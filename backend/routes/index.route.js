const router = require("express").Router();

const storesRoute = require("./stores.route.js");
const productsRoute = require("./products.route.js");
const ordersRoute = require("./orders.route.js");
const subscriptionsRoute = require("./subscriptions.route.js");
const usersRoute = require("./users.route.js");
const paymentsRoute = require("./payments.route.js");
const revenueRoute = require("./revenue.route.js");
const authRoute = require("./auth.route.js");

const authMiddleware = require("../middlewares/auth.middleware.js");

router.use("/stores/", authMiddleware, storesRoute);
router.use("/products/", authMiddleware, productsRoute);
router.use("/orders/", authMiddleware, ordersRoute);
router.use("/subscriptions/", authMiddleware, subscriptionsRoute);
router.use("/users/", authMiddleware, usersRoute);
router.use("/payments/", authMiddleware, paymentsRoute);
router.use("/revenue/", authMiddleware, revenueRoute);
router.use("/auth", authRoute);

module.exports = router;
