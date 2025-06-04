const router = require("express").Router();

const storesRoute = require("./stores.route.js");
const productsRoute = require("./products.route.js");
const ordersRoute = require("./orders.route.js");
const subscriptionsRoute = require("./subscriptions.route.js");
const authRoute = require("./auth.route.js");

router.use("/stores/", storesRoute);
router.use("/products/", productsRoute);
router.use("/orders/", ordersRoute);
router.use("/subscriptions/", subscriptionsRoute);
router.use("/auth", authRoute);

module.exports = router;
