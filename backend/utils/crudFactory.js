const CreateError = require("./createError.js");
const supabase = require("../config/supabaseClient.js");

const createCRUDController = (table) => {
    return {
        getAll: async (req, res, next) => {
            const { data, error } = await supabase.from(table).select("*");
            if (error) return next(new CreateError(500, error.message));
            res.status(200).json({ success: true, data });
        },

        getById: async (req, res, next) => {
            const { id } = req.params;
            const { data, error } = await supabase
                .from(table)
                .select("*")
                .eq("id", id)
                .single();
            if (error || !data)
                return next(new CreateError(404, "Item not found"));
            res.status(200).json({ success: true, data });
        },

        create: async (req, res, next) => {
            const { data, error } = await supabase
                .from(table)
                .insert(req.body)
                .select()
                .single();
            if (error) return next(new CreateError(400, error.message));
            res.status(201).json({ success: true, data });
        },

        updateById: async (req, res, next) => {
            const { id } = req.params;
            const { data, error } = await supabase
                .from(table)
                .update(req.body)
                .eq("id", id)
                .select()
                .single();
            if (error || !data)
                return next(new CreateError(404, "Update failed"));
            res.status(200).json({ success: true, data });
        },

        deleteById: async (req, res, next) => {
            const { id } = req.params;
            const { error } = await supabase.from(table).delete().eq("id", id);
            if (error) return next(new CreateError(404, "Delete failed"));
            res.status(204).send();
        },
    };
};

module.exports = createCRUDController;
