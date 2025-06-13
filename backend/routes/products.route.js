const router = require("express").Router();
const productsController = require("../controllers/products.controller.js");

router
    .route("/")
    .get(productsController.getAllProducts)
    .post(productsController.addProduct);
router
    .route("/:id")
    .get(productsController.getProductById)
    .patch(productsController.updateProductById)
    .delete(productsController.deleteProductById);

module.exports = router;
