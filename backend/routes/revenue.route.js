const revenueController = require("../controllers/revenue.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = require("express").Router();

router.get("/", authMiddleware, revenueController.getTotalRevenue);
router.get(
    "/products/:productId",
    authMiddleware,
    revenueController.getRevenueByProduct
);
router.get(
    "/stores/:storeId",
    authMiddleware,
    revenueController.getRevenueByStore
);

module.exports = router;
