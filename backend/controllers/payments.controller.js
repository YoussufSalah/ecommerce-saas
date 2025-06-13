const asyncWrapper = require("../utils/asyncWrapper.js");
const createCRUDController = require("../utils/crudFactory.js");

const factory = createCRUDController("payments");

module.exports = {
    getAllPayments: asyncWrapper(factory.getAll),
    getPaymentById: asyncWrapper(factory.getById),
    addPayment: asyncWrapper(factory.create),
    updatePaymentById: asyncWrapper(factory.updateById),
    deletePaymentById: asyncWrapper(factory.deleteById),
};
