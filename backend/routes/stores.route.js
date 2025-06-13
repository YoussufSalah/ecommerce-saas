const router = require("express").Router();
const storesController = require("../controllers/stores.controller.js");

router
    .route("/")
    .get(storesController.getAllStores)
    .post(storesController.addStore);
router
    .route("/:id")
    .get(storesController.getStoreById)
    .patch(storesController.updateStoreById)
    .delete(storesController.deleteStoreById);

module.exports = router;
