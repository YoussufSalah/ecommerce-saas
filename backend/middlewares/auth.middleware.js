const jwt = require("jsonwebtoken");
const CreateError = require("../utils/createError.js");
const supabase = require("../config/supabaseClient.js");

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new CreateError(401, "No token provided"));
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.decode(token);

        if (!decoded || !decoded.email) {
            return next(new CreateError(401, "Invalid token payload"));
        }

        const { data: user, error: fetchUserError } = await supabase
            .from("users")
            .select("id, first_name, last_name, role_id, email")
            .eq("email", decoded.email)
            .single();

        if (!user || fetchUserError) {
            return next(new CreateError(404, "User Not Found!"));
        }

        req.user = user;
        next();
    } catch (err) {
        return next(new CreateError(401, "Invalid token"));
    }
};

module.exports = authMiddleware;
