const { supabase } = require("../config/supabaseClient.js");
const createError = require("../utils/createError.js");

const register = async (req, res, next) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) return next(createError(400, error.message));

    const user = data.user;

    const { error: insertError } = await supabase.from("users").insert([
        {
            id: user.id,
            email: user.email,
            role: "seller",
            store_id: null,
        },
    ]);

    if (insertError) return next(createError(500, insertError.message));

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

    if (error) return next(createError(400, error.message));

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
