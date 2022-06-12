const { Field, fieldType } = require("./Field.js");
const directions = require("../Enums/Directions");
const Card = require("./Card");

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

    //#region gems

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

    //#endregion

    //#region cards

    placeCard(card, position, direction, firstPlayer) {
        if (!this.canPlaceCard(card, position, direction)) return false;

        this.firstPlayerTurn = !this.firstPlayerTurn;

        let field = this.#board[position.y][position.x];

        if (direction == directions.none || field.card == null) {
            field.card = new Card(card, position, firstPlayer);
            return true;
        }

        let nextField = field;
        let fields = [];

        fields.push(field);

        do {
            let directionVector = this.#getDirectionVector(direction);
            let nextFieldPosition = { x: nextField.position.x * 1 + directionVector.x, y: nextField.position.y * 1 + directionVector.y };
            nextField = this.#board[nextFieldPosition.y][nextFieldPosition.x];
            fields.push(nextField);
        } while (nextField.card != null);

        for (let i = fields.length - 1; i >= 0; i--) {
            fields[i].card = i == 0 ? card : fields[i - 1].card;
        }
        return true;
    }

    canPlaceCard(card, position, direction) {
        if (position.y < 0 || position.y >= this.#board.length) {
            console.error("wrong position data at canPlaceCard (74) in Game.js");
            return { value: false, message: "wrong position" };
        }

        if (position.x < 0 || position.x >= this.#board[position.y].length) {
            console.error("wrong position data at canPlaceCard (74) in Game.js");
            return { value: false, message: "wrong position" };
        }
        let field = this.#board[position.y][position.x];
        if (direction == directions.none) {
            if (field.gem) {
                return { value: false, message: "You cant place card on a gem!" };
            } else if (field.card != null) {
                return { value: false, message: "This space is occupied!" };
            } else if (field.type != fieldType.normal) {
                return { value: false, message: "You cant place card here!" };
            } else {
                return { value: true, message: "" };
            }
        }

        if (field.type == fieldType.none) return { value: false, message: "You cant push cards off board!" };
        if (field.card == null) return { value: true, message: "" };

        if (field.card.arrows[this.#getOpositeDirection(direction)] < card.arrows[direction]) {
            let directionVector = this.#getDirectionVector(direction);
            let nextFieldPosition = { x: position.x * 1 + directionVector.x, y: position.y * 1 + directionVector.y };
            return this.canPlaceCard(card, nextFieldPosition, direction);
        } else {
            return { value: false, message: "You cant push card with greater arrow!" };
        }
    }

    isFieldEmpty(position) {
        if (position.y < 0 || position.y >= this.#board.length) {
            console.error("wrong position data at isFieldEmpty (130) in Game.js");
            return false;
        }
        if (position.x < 0 || position.x >= this.#board[position.y].length) {
            console.error("wrong position data at isFieldEmpty (130) in Game.js");
            return false;
        }

        return this.#board[position.y][position.x].card == null;
    }

    #getDirectionVector(direction) {
        switch (direction) {
            case directions.up:
                return { x: 0, y: -1 };
            case directions.down:
                return { x: 0, y: 1 };
            case directions.right:
                return { x: 1, y: 0 };
            case directions.left:
                return { x: -1, y: 0 };
            default:
                return { x: 0, y: 0 };
        }
    }

    #getOpositeDirection(direction) {
        switch (direction) {
            case directions.up:
                return directions.down;
            case directions.down:
                return directions.up;
            case directions.right:
                return directions.left;
            case directions.left:
                return directions.right;
            default:
                return directions.none;
        }
    }

    //#endregion

    isGameEnd(hand) {
        // for (let y in this.#board) {
        //     for (let x in this.#board[y]) {
        //         let field = this.#board[y][x];
        //         if (field.card == null && field.type == fieldType.normal) {
        //             return false;
        //         }
        //     }
        // }

        let gameEnd = true;
        for (let y in this.#board) {
            for (let x in this.#board[y]) {
                let field = this.#board[y][x];
                if (field.card == null && field.type == fieldType.normal) {
                    gameEnd = false;
                    break;
                }
            }
        }
        if (gameEnd) return true;

        for (let y in this.#board) {
            for (let x in this.#board[y]) {
                let field = this.#board[y][x];
                if (field.card != null && field.type == fieldType.normal) {
                    for (let handCard of hand) {
                        for (let direction = 0; direction < 3; direction++) {
                            if (this.canPlaceCard(handCard, { x: field.position.x, y: field.position.y }, direction)) return false;
                        }
                    }
                }
            }
        }
        return true;
    }

    // 0 - draw, 1 - firstPlayer win, -1 - second player win
    getWinner() {
        let firstPlayerScore = 0;
        let secondPlayerScore = 0;

        for (let y in this.#board) {
            for (let x in this.#board[y]) {
                let field = this.#board[y][x];
                if (field.gem && field.card != null) {
                    if (field.card.firstPlayer) firstPlayerScore++;
                    else secondPlayerScore++;
                }
            }
        }

        if (firstPlayerScore == secondPlayerScore) return 0;
        else if (firstPlayerScore > secondPlayerScore) return 1;
        else return -1;
    }

    #getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
};
