const router = require("express").Router();
const ordersController = require("../controllers/orders.controller.js");

router
    .route("/")
    .get(ordersController.getAllOrders)
    .post(ordersController.addOrder);

router
    .route("/:id/")
    .get(ordersController.getOrderById)
    .patch(ordersController.updateOrderById)
    .delete(ordersController.deleteOrderById);

router.get("/stores/:id/", ordersController.getStoreOrders);

module.exports = router;
