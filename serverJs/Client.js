module.exports = class Client {
    #room = null;
    #player = null;

    constructor(player, room) {
        this.#room = room;
        this.#player = player;
    }
};
