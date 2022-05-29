const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");

app.use(express.json());

const server = app.listen(PORT, () => {
    console.log("start serwera na porcie " + PORT);
});

const io = require("socket.io")(server);

io.on("connection", (socket) => {
    console.log("a user connected");
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/static/html/index.html"));
});

app.use(express.static("static"));
