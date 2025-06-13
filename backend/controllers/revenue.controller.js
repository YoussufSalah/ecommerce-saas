const asyncWrapper = require("../utils/asyncWrapper.js");
const CreateError = require("../utils/createError.js");
const supabase = require("../config/supabaseClient.js");

const revenueController = {
    getRevenueByProduct: asyncWrapper(async (req, res, next) => {
        const { productId } = req.params;

        const { data, error } = await supabase
            .from("orders_products")
            .select("quantity, product:product_id(price)")
            .eq("product_id", productId);

        if (!data)
            return next(
                new CreateError(
                    404,
                    "Product not found or product hasn't been ordered yet!"
                )
            );
        if (error) return next(error);

        const revenue = data.reduce((sum, row) => {
            return sum + row.quantity * row.product.price;
        }, 0);

        res.status(200).json({ success: true, revenue });
    }),

    getRevenueByStore: asyncWrapper(async (req, res, next) => {
        const { storeId } = req.params;

        const { data, error } = await supabase
            .from("orders_products")
            .select(
                `
            quantity,
            product:product_id(price, store_id)
        `
            )
            .eq("product.store_id", storeId);
        if (!data)
            return next(
                new CreateError(404, "Store not found or store has no sales!")
            );
        if (error) return next(error);

        const revenue = data.reduce((sum, row) => {
            return sum + row.quantity * row.product.price;
        }, 0);

        res.status(200).json({ success: true, revenue });
    }),

    getTotalRevenue: asyncWrapper(async (req, res, next) => {
        const userId = req.user.user_id;

        const { data, error } = await supabase
            .from("orders_products")
            .select(
                `
            quantity,
            product:product_id(price, store:store_id(user_id))
        `
            )
            .eq("product.store.user_id", userId);

        if (!data)
            return next(
                new CreateError(
                    404,
                    "User doesn't have stores, or user stores have no sales!"
                )
            );
        if (error) return next(error);

        const revenue = data.reduce((sum, row) => {
            return sum + row.quantity * row.product.price;
        }, 0);

        res.status(200).json({ success: true, revenue });
    }),
};
module.exports = revenueController;
