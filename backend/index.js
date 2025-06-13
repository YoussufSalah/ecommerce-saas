const express = require("express");
const app = express();

require("dotenv").config();

app.use(express.json());

const router = require("./routes/index.route.js");
app.use("/api/", router);

const errorHandler = require("./middlewares/errorHandler.middleware.js");
app.use(errorHandler);

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});
