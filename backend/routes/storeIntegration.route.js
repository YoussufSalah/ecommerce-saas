const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware.js");
const storeIntegrationController = require("../controllers/storeIntegration.controller.js");

// Shopify Routes
router.get(
    "/shopify/install",
    authMiddleware,
    storeIntegrationController.shopify.install
);
router.get("/shopify/callback", storeIntegrationController.shopify.callback);
router.post(
    "/shopify/sync/products/:storeId",
    authMiddleware,
    storeIntegrationController.shopify.sync.products
);
router.post(
    "/shopify/sync/orders/:storeId",
    authMiddleware,
    storeIntegrationController.shopify.sync.orders
);

module.exports = router;
