const router = require("express").Router();
const paymentsController = require("../controllers/payments.controller.js");

router
    .route("/")
    .get(paymentsController.getAllPayments)
    .post(paymentsController.addPayment);
router
    .route("/:id")
    .get(paymentsController.getPaymentById)
    .patch(paymentsController.updatePaymentById)
    .delete(paymentsController.deletePaymentById);

module.exports = router;
