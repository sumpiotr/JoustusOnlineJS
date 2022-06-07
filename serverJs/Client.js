module.exports = class Client {
    #player = null;

    constructor(player) {
        this.#player = player;
    }

    joinRoom(room) {
        this.room = room;
        if (room.join(this.#player)) {
            if (!room.waiting) {
                this.#player.emit("startGame");
                this.room.getOppositePlayer(this.#player).emit("startGame");
            }
        }
    }
};
