const express = require("express");
const app = express();

const router = require("./routes/index.route.js");
app.use("/api/", router);

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});
