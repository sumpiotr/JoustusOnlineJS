module.exports = class Room {
    #players = [];

    constructor(publicRoom, player, name = "", password = "") {
        this.waiting = true;
        this.publicRoom = publicRoom;
        this.name = name;
        this.password = password;
        this.#players.push(player);
    }

    join(newPlayer) {
        if (this.#players.length < 2) {
            this.waiting = false;
            this.#players.push(newPlayer);
            this.#players[0].emit("startGame");
            this.#players[1].emit("startGame");
            return true;
        } else {
            return false;
        }
    }

    getOppositePlayer(player) {
        const oppositePlayer = this.#players[0] == player ? this.#players[1] : this.#players[0];
    }
};
