const router = require("express").Router();
const subscriptionsController = require("../controllers/subscriptions.controller.js");

router
    .route("/")
    .get(subscriptionsController.getAllSubscriptions)
    .post(subscriptionsController.addSubscription);
router
    .route("/:id")
    .get(subscriptionsController.getSubscriptionById)
    .patch(subscriptionsController.updateSubscriptionById)
    .delete(subscriptionsController.deleteSubscriptionById);

module.exports = router;
