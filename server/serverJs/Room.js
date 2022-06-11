const Game = require("./Game/Game.js");

module.exports = class Room {
    #players = [];
    #clients = [];

    constructor(publicRoom, name = "", password = "") {
        this.waiting = true;
        this.publicRoom = publicRoom;
        this.name = name;
        this.password = password;

        this.game = new Game();
    }

    join(newSocket, client) {
        if (this.#players.length < 2) {
            this.#clients.push(client);
            this.#players.push(newSocket);
            if (this.#players.length == 2) this.waiting = false;
            return true;
        } else {
            return false;
        }
    }

    startGame() {
        for (let client of this.#clients) {
            client.startGame();
        }
    }

    getOppositePlayer(player) {
        const oppositePlayer = this.#players[0] == player ? this.#players[1] : this.#players[0];
        return oppositePlayer;
    }
};
