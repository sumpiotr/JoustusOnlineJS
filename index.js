const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");
const Room = require("./serverJs/Room");
const Client = require("./serverJs/Client");

app.use(express.json());

const rooms = [];

const server = app.listen(PORT, () => {
    console.log("start serwera na porcie " + PORT);
});

const io = require("socket.io")(server);

io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("createRoom", (publicRoom, name, password) => {
        if (publicRoom) {
            for (let room of rooms) {
                if (room.publicRoom && room.waiting) {
                    let client = new Client(socket, room);
                    room.join(socket);

                    return;
                }
            }
        } else {
            password = password.trim();
            name = name.trim();
            if (password == "" || name == "") {
                return;
            }
            for (let room of rooms) {
                if (room.name == name) {
                    return;
                }
            }
        }
        const room = new Room(publicRoom, socket, name, password);
        rooms.push(room);
        let client = new Client(socket, room);
        socket.emit("createRoom", publicRoom, "");
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/static/html/index.html"));
});

app.use(express.static("static"));
