const axios = require("axios");
const querystring = require("querystring");
const supabase = require("../config/supabaseClient.js");
const CreateError = require("../utils/createError.js");
const asyncWrapper = require("../utils/asyncWrapper.js");

const {
    SHOPIFY_API_KEY,
    SHOPIFY_API_SECRET,
    SHOPIFY_SCOPES,
    SHOPIFY_REDIRECT_URI,
} = process.env;

let supportedStores;
(async () => {
    supportedStores = await supabase.from("supported_stores").select("*");
})();

const shopify = {
    install: asyncWrapper(async (req, res, next) => {
        const { shop } = req.query;
        req.user = { id: "59e142fc-e63b-44c3-92d7-073176bdc89b" };

        if (!shop) return next(new CreateError(400, "Missing shop parameter"));

        const installUrl =
            `https://${shop}/admin/oauth/authorize?` +
            querystring.stringify({
                client_id: SHOPIFY_API_KEY,
                scope: SHOPIFY_SCOPES,
                redirect_uri: SHOPIFY_REDIRECT_URI,
                state: req.user.id,
            });

        res.redirect(installUrl);
    }),
    callback: asyncWrapper(async (req, res, next) => {
        console.log("Shopify callback hit");
        const { shop, code, state } = req.query;

        if (!shop || !code) {
            return next(new CreateError(400, "Missing shop or code in query"));
        }

        const { data } = await axios.post(
            `https://${shop}/admin/oauth/access_token`,
            {
                client_id: SHOPIFY_API_KEY,
                client_secret: SHOPIFY_API_SECRET,
                code,
            }
        );

        const accessToken = data.access_token;

        const { data: shopData } = await axios.get(
            `https://${shop}/admin/api/2023-10/shop.json`,
            {
                headers: {
                    "X-Shopify-Access-Token": accessToken,
                },
            }
        );

        const storeName = shopData.shop.name;
        const { error } = await supabase.from("stores").insert({
            url: shop,
            platform_id: supportedStores.data.filter(
                (store) => store.name === "shopify"
            )[0].id,
            user_id: state,
            access_token: accessToken,
            name: storeName,
        });

        if (error) return next(new CreateError(400, error.message));

        res.redirect("/dashboard?connected=shopify");
    }),
    sync: {
        products: asyncWrapper(async (req, res, next) => {
            const storeId = req.params.storeId;
            const { data: store, error } = await supabase
                .from("stores")
                .select("*")
                .eq("id", storeId)
                .single();

            if (!store || error)
                return next(
                    new CreateError(404, error.message || "Store not found")
                );

            const { url, access_token } = store;

            const { data: productResponse } = await axios.get(
                `https://${url}/admin/api/2023-10/products.json`,
                {
                    headers: {
                        "X-Shopify-Access-Token": access_token,
                    },
                }
            );

            const products = productResponse.products;

            const insertable = products.map((p) => ({
                title: p.title,
                description: p.body_html,
                price: p.variants[0]?.price || "0",
                store_id: storeId,
                external_id: p.id.toString(),
            }));

            await supabase.from("products").insert(insertable);

            res.status(201).json({ success: true, data: insertable });
        }),
        orders: asyncWrapper(async (req, res, next) => {
            const storeId = req.params.storeId;
            const { data: store, error } = await supabase
                .from("stores")
                .select("*")
                .eq("id", storeId)
                .single();

            if (!store || error)
                return next(
                    new CreateError(404, error.message || "Store not found")
                );

            const { url, access_token } = store;

            const { data: ordersRes } = await axios.get(
                `https://${url}/admin/api/2023-10/orders.json`,
                {
                    headers: {
                        "X-Shopify-Access-Token": access_token,
                    },
                }
            );

            const orders = ordersRes.orders;

            for (const shopifyOrder of orders) {
                const orderRecord = {
                    external_id: shopifyOrder.id.toString(),
                    order_number: shopifyOrder.order_number,
                    store_id: storeId,
                    customer_name: `${
                        shopifyOrder.customer?.first_name || ""
                    } ${shopifyOrder.customer?.last_name || ""}`.trim(),
                    total_price: shopifyOrder.total_price,
                    order_status: shopifyOrder.financial_status,
                    created_at: shopifyOrder.created_at,
                };

                const { data: orderData, error: orderError } = await supabase
                    .from("orders")
                    .upsert(orderRecord, {
                        onConflict: ["external_id", "store_id"],
                    })
                    .select()
                    .single();

                if (orderError) {
                    console.error("Order insert error:", orderError.message);
                    return next(new CreateError(403, orderError.message));
                }

                const lineItems = shopifyOrder.line_items;
                const orderProducts = [];

                for (const item of lineItems) {
                    const { data: productData, error: productError } =
                        await supabase
                            .from("products")
                            .select("id")
                            .eq("external_id", item.product_id.toString())
                            .eq("store_id", storeId)
                            .single();

                    if (productError || !productData) {
                        console.error(
                            "Product Fetching Error:",
                            orderError.message
                        );
                        return next(new CreateError(404, productError.message));
                    }

                    orderProducts.push({
                        order_id: orderData.id,
                        product_id: productData.id,
                        quantity: item.quantity,
                        price: item.price,
                        total:
                            parseFloat(item.quantity) * parseFloat(item.price),
                    });
                }

                if (orderProducts.length) {
                    const { error: opError } = await supabase
                        .from("orders_products")
                        .upsert(orderProducts, {
                            onConflict: ["order_id", "product_id"],
                        });

                    if (opError) {
                        console.error(
                            `orders_products insert error for order ${orderData.id}:`,
                            opError.message
                        );
                        return next(new CreateError(403, opError.message));
                    }
                }
            }

            res.status(201).json({ success: true, data: orders });
        }),
    },
};

const storeIntegrationController = { shopify };

module.exports = storeIntegrationController;
