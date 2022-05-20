const express = require("express");
const app = express();
const PORT = 3000;
var path = require("path");

app.use(express.json());

players = [];

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/static/html/index.html"));
});

app.use(express.static("static"));
app.listen(PORT, () => {
    console.log("start serwera na porcie " + PORT);
});
