const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.ADMIN_SUPABASE_KEY
);

module.exports = supabase;
