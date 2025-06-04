const jwt = require("jsonwebtoken");
const createError = require("../utils/createError.js");

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(createError(401, "No token provided"));
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, SUPABASE_JWT_SECRET);

        req.user = decoded;
        next();
    } catch (err) {
        return next(createError(401, "Invalid token"));
    }
};

module.exports = authMiddleware;
