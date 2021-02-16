const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const pathToTemplate = path.join(path.resolve(), "public", "index.html");
const template = fs.readFileSync(pathToTemplate, "utf-8");
debugger;
app.use("/", express.static(path.join(path.resolve(), "public")));
app.use(
    "/images",
    express.static(path.join(path.resolve(), "public", "images"))
);

app.get("/", (_req, res) => {
    debugger;
    res.end(template);
});

app.listen(4200);
