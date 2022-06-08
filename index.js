const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");
const Room = require("./server/serverJs/Room");
const Client = require("./server/serverJs/Client");

app.use(express.json());

const rooms = [];

const cards = require("./server/data/cards.json");
const defaultDecks = require("./server/data/defaultDecks.json");

const server = app.listen(PORT, () => {
    console.log("start serwera na porcie " + PORT);
});

const io = require("socket.io")(server);

io.on("connection", (socket) => {
    const client = new Client(socket);

    socket.on("disconnect", () => {
        if (client.room != null) {
            if (client.room.waiting) {
                rooms.splice(rooms.indexOf(client.room), 1);
            } else {
                //send second player that they are the winner
            }
        }
    });

    socket.on("createRoom", (publicRoom, name, password) => {
        if (publicRoom) {
            for (let room of rooms) {
                if (room.publicRoom && room.waiting) {
                    client.joinRoom(room);
                    return;
                }
            }
        } else {
            password = password.trim();
            name = name.trim();
            if (password == "" || name == "") {
                socket.emit("createRoom", "Password and name cannot be empty!");
                return;
            }
            for (let room of rooms) {
                if (room.name == name) {
                    socket.emit("createRoom", "A room by that name already existsy!");
                    return;
                }
            }
        }
        const room = new Room(publicRoom, name, password);
        rooms.push(room);
        client.joinRoom(room);
        socket.emit("createRoom", "");
    });

    socket.on("joinRoom", (name, password) => {
        for (let room of rooms) {
            if (!room.publicRoom) {
                if (room.name == name && room.password == password) {
                    client.joinRoom(room);
                    return;
                }
            }
        }
        socket.emit("createRoom", "Wrong room name or password!");
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/static/html/index.html"));
});

app.use(express.static("static"));
