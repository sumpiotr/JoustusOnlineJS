const { Field, fieldType } = require("./Field.js");

module.exports = class Game {
    //-1 -none, 0 - graveyard, 1 - field

    #gemCount = 3;

    #boardTemplate = [
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, 0, 0, 0, -1, -1],
        [-1, 0, 1, 1, 1, 0, -1],
        [-1, 0, 1, 1, 1, 0, -1],
        [-1, 0, 1, 1, 1, 0, -1],
        [-1, -1, 0, 0, 0, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
    ];

    #board = [];

    #gemFields = [];

    constructor() {
        this.firstPlayerTurn = this.#getRandomInt(0, 2) == 1;
        this.gameStarted = false;

        this.#generateBoard();
    }

    #generateBoard() {
        for (let y in this.#boardTemplate) {
            this.#board.push([]);
            for (let x in this.#boardTemplate[y]) {
                this.#board[y].push(new Field(this.#boardTemplate[y][x], x, y));
            }
        }

        this.#generateGems();
    }

    #generateGems() {
        for (let i = 0; i < this.#gemCount; i++) {
            let gemField = this.#getRandomEmptyField();
            gemField.gem = true;
            this.#gemFields.push(gemField);
        }
    }

    getGemsPosition() {
        let positions = [];
        for (let gemField of this.#gemFields) {
            positions.push(gemField.position);
        }
        return positions;
    }

    #getRandomEmptyField() {
        let field = null;
        do {
            let y = Math.floor(this.#getRandomInt(0, this.#board.length));
            let x = Math.floor(this.#getRandomInt(0, this.#board[y].length));
            field = this.#board[y][x];
        } while (field.type != fieldType.normal || field.gem);

        return field;
    }

    #getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
};
