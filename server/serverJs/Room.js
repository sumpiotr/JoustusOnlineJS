const Game = require("./Game/Game.js");

module.exports = class Room {
    #players = [];

    constructor(publicRoom, name = "", password = "") {
        this.waiting = true;
        this.publicRoom = publicRoom;
        this.name = name;
        this.password = password;

        this.game = new Game();
    }

    join(newPlayer) {
        if (this.#players.length < 2) {
            this.#players.push(newPlayer);
            if (this.#players.length == 2) this.waiting = false;
            return true;
        } else {
            return false;
        }
    }

    getOppositePlayer(player) {
        const oppositePlayer = this.#players[0] == player ? this.#players[1] : this.#players[0];
        return oppositePlayer;
    }
};
