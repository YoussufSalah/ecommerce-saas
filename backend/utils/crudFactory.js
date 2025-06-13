const CreateError = require("./createError.js");
const supabase = require("../config/supabaseClient.js");
const generateProductContent = require("./openrouter.js");

const createCRUDController = (table, view = null) => {
    const source = view || table;
    const supportsSoftDelete = ["users", "stores"].includes(table);
    return {
        getAll: async (req, res, next) => {
            const {
                page = 1,
                limit = 10,
                sortBy = req.query.sortBy || "id",
                order = "desc",
                search,
                ...filters
            } = req.query;

            const offset = (page - 1) * limit;

            let query = supabase
                .from(source)
                .select("*", { count: "exact" })
                .order(sortBy, { ascending: order === "asc" })
                .range(offset, offset + parseInt(limit) - 1);

            for (const key in filters) {
                if (key.startsWith("min_")) {
                    const col = key.replace("min_", "");
                    query = query.gte(col, filters[key]);
                } else if (key.startsWith("max_")) {
                    const col = key.replace("max_", "");
                    query = query.lte(col, filters[key]);
                } else {
                    query = query.eq(key, filters[key]);
                }
            }

            if (
                search &&
                ["title", "name"].some((f) => f in filters === false)
            ) {
                query = query.ilike("title", `%${search}%`);
            }

            const { data, error, count } = await query;
            if (error) return next(error);

            res.status(200).json({
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                totalPages: Math.ceil(count / limit),
                data,
            });
        },

        getById: async (req, res, next) => {
            const { id } = req.params;
            const { data, error } = await supabase
                .from(source)
                .select("*")
                .eq("id", id)
                .single();
            if (error || !data)
                return next(new CreateError(404, "Item not found"));
            res.status(200).json({ success: true, data });
        },

        create: async (req, res, next) => {
            const userId = req.user.id;
            const { products, features, ...insertableData } = req.body;
            if (source === "products") {
                if (!insertableData.store_id) {
                    const { data: store, error: storeError } = await supabase
                        .from("stores")
                        .select("id")
                        .eq("user_id", userId)
                        .single();

                    if (!store)
                        return next(new CreateError(404, "Store Not Found!"));
                    if (storeError) return next(storeError);

                    insertableData.store_id = store.id;
                }
                if (Array.isArray(features) && features.length >= 1) {
                    const { description, tags } = await generateProductContent(
                        insertableData.title,
                        features
                    );
                    insertableData.ai_description = description;
                    insertableData.ai_tags = tags;
                }
            }

            const { data, error } = await supabase
                .from(source)
                .insert(insertableData)
                .select()
                .single();

            if (error) return next(new CreateError(400, error.message));

            if (source === "orders") {
                const orderId = data.id;

                if (!Array.isArray(products) || products.length === 0) {
                    return next(
                        new CreateError(
                            400,
                            "Products array is required for an order"
                        )
                    );
                }

                const { data: existingProducts, error: productCheckError } =
                    await supabase
                        .from("products")
                        .select("id")
                        .in("id", products);

                if (
                    productCheckError ||
                    existingProducts.length !== products.length
                ) {
                    return next(
                        new CreateError(400, "Some product IDs are invalid.")
                    );
                }

                const orderProducts = products.map((product_id) => ({
                    order_id: orderId,
                    product_id,
                }));

                const uniquePairs = Array.from(
                    new Set(
                        orderProducts.map(
                            (p) => `${p.order_id}:${p.product_id}`
                        )
                    )
                ).map((str) => {
                    const [order_id, product_id] = str.split(":");
                    return { order_id, product_id };
                });

                const { error: opError } = await supabase
                    .from("orders_products")
                    .insert(uniquePairs);
                if (opError) {
                    return next(new CreateError(400, opError.message));
                }
            }

            res.status(201).json({ success: true, data });
        },

        updateById: async (req, res, next) => {
            const { features, ...newData } = req.body;
            const { id } = req.params;

            if (source === "products") {
                if (Array.isArray(features) && features.length > 0) {
                    let title;
                    if (req.body.title) title = req.body.title;
                    else {
                        const { data, error } = await supabase
                            .from("products")
                            .select("title")
                            .eq("id", id);
                        if (!data || error)
                            return next(
                                new CreateError(
                                    404,
                                    `${
                                        !data
                                            ? "Product not found!"
                                            : `${error.message}`
                                    }`
                                )
                            );
                        title = data.title;
                    }

                    const { description, tags } = await generateProductContent(
                        title,
                        features
                    );
                    newData.ai_description = description;
                    newData.ai_tags = tags;
                }
            }

            const { data, error } = await supabase
                .from(source)
                .update(newData)
                .eq("id", id)
                .select()
                .single();
            if (error || !data)
                return next(new CreateError(404, "Update failed"));
            res.status(200).json({ success: true, data });
        },

        deleteById: async (req, res, next) => {
            const { id } = req.params;

            const { data: existingRow, error: fetchError } = await supabase
                .from(source)
                .select("id")
                .eq("id", id)
                .single();

            if (fetchError || !existingRow) {
                return next(
                    new CreateError(404, `${source} with ID ${id} not found`)
                );
            }

            if (supportsSoftDelete) {
                const { data: softDeletedRow, error: softDeleteError } =
                    await supabase
                        .from(table)
                        .update({ deleted_at: new Date().toISOString() })
                        .eq("id", id)
                        .select()
                        .single();
                if (softDeleteError || !softDeletedRow) {
                    return next(new CreateError(500, "Soft delete failed"));
                }
                res.status(200).json({
                    message: "Soft deleted successfully",
                    id,
                    data: softDeletedRow,
                });
            } else {
                const { error: hardDeleteError } = await supabase
                    .from(table)
                    .delete()
                    .eq("id", id);
                if (hardDeleteError) {
                    return next(new CreateError(500, "Soft delete failed"));
                }
                res.status(200).json({
                    message: "Deleted successfully",
                    id,
                });
            }
        },
    };
};

module.exports = createCRUDController;
