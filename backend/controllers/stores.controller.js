const asyncWrapper = require("../utils/asyncWrapper.js");
const createCRUDController = require("../utils/crudFactory.js");

const factory = createCRUDController("stores", "active_stores");

module.exports = {
    getAllStores: asyncWrapper(factory.getAll),
    getStoreById: asyncWrapper(factory.getById),
    addStore: asyncWrapper(factory.create),
    updateStoreById: asyncWrapper(factory.updateById),
    deleteStoreById: asyncWrapper(factory.deleteById),
};
