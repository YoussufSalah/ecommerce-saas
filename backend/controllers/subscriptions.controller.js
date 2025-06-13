const asyncWrapper = require("../utils/asyncWrapper.js");
const createCRUDController = require("../utils/crudFactory.js");

const factory = createCRUDController("subscriptions");

module.exports = {
    getAllSubscriptions: asyncWrapper(factory.getAll),
    getSubscriptionById: asyncWrapper(factory.getById),
    addSubscription: asyncWrapper(factory.create),
    updateSubscriptionById: asyncWrapper(factory.updateById),
    deleteSubscriptionById: asyncWrapper(factory.deleteById),
};
