const router = require("express").Router();
const ordersController = require("../controllers/orders.controller.js");

router
    .route("/")
    .get(ordersController.getAllOrders)
    .post(ordersController.addOrder);
router
    .route("/:orderId")
    .get(ordersController.getOrderById)
    .patch(ordersController.updateOrderById)
    .delete(ordersController.deleteOrderById);

module.exports = router;
