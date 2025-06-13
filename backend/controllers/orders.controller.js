const asyncWrapper = require("../utils/asyncWrapper.js");
const createCRUDController = require("../utils/crudFactory.js");

const factory = createCRUDController("orders");

module.exports = {
    getAllOrders: asyncWrapper(factory.getAll),
    getOrderById: asyncWrapper(factory.getById),
    getStoreOrders: asyncWrapper(async (req, res, next) => {
        const storeId = req.params.storeId;

        const { data, error } = await supabase
            .from("orders")
            .select("*, order_products(*, products(*))")
            .contains("order_products.products.store_id", storeId);

        if (error) return next(error);
        res.status(200).json({ data });
    }),
    addOrder: asyncWrapper(factory.create),
    updateOrderById: asyncWrapper(factory.updateById),
    deleteOrderById: asyncWrapper(factory.deleteById),
};
