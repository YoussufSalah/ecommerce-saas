const supabase = require("../config/supabaseClient.js");
const CreateError = require("../utils/createError.js");
const register = async (req, res, next) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                phone: req.body.phone,
                avatar_url: req.body.avatar_url,
            },
        },
    });

    if (error) return next(new CreateError(400, error.message));

    const user = data.user;

    res.status(201).json({
        message: "User registered successfully",
        user,
    });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) return next(new CreateError(400, error.message));

    res.status(200).json({
        message: "Login successful",
        user: data.user,
        access_token: data.session.access_token,
    });
};

module.exports = {
    register,
    login,
};
