const asyncWrapper = require("../utils/asyncWrapper.js");
const createCRUDController = require("../utils/crudFactory.js");

const factory = createCRUDController("users", "active_users");

module.exports = {
    getAllUsers: asyncWrapper(factory.getAll),
    getUserById: asyncWrapper(factory.getById),
    addUser: asyncWrapper(factory.create),
    updateUserById: asyncWrapper(factory.updateById),
    deleteUserById: asyncWrapper(factory.deleteById),
};
