const asyncWrapper = require("../utils/asyncWrapper.js");
const createCRUDController = require("../utils/crudFactory.js");

const factory = createCRUDController("products");

module.exports = {
    getAllProducts: asyncWrapper(factory.getAll),
    getProductById: asyncWrapper(factory.getById),
    addProduct: asyncWrapper(factory.create),
    updateProductById: asyncWrapper(factory.updateById),
    deleteProductById: asyncWrapper(factory.deleteById),
};
