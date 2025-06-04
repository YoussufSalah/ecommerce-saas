const asyncWrapper = require("../utils/asyncWrapper.js");
const createCRUDController = require("../utils/crudFactory.js");

const factory = createCRUDController("orders");

module.exports = {
    getAllOrders: asyncWrapper(factory.getAll),
    getOrderById: asyncWrapper(factory.getById),
    addOrder: asyncWrapper(factory.create),
    updateOrderById: asyncWrapper(factory.updateById),
    deleteOrderById: asyncWrapper(factory.deleteById),
};
