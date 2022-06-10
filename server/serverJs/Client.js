const Deck = require("./Deck");
const defaultDeck = require("../data/defaultDecks.json").cards;
const cards = require("../data/cards.json").cards;

module.exports = class Client {
    #player = null;
    #sqlite = null;
    #deckDb = null;
    #deck = null;

    constructor(player, sqlite, deckDb) {
        this.#player = player;
        this.#sqlite = sqlite;
        this.#deckDb = deckDb;
        this.#deck = new Deck(defaultDeck);
        this.room = null;
        this.logged = false;
        this.playerId = -1;

        this.firstPlayer = true;

        this.setSocket();
    }

    setSocket() {
        this.#player.on("isLogged", () => {
            this.#player.emit("isLogged", this.logged);
        });

        //#region edit deck

        this.#player.on("getDeck", () => {
            this.#player.emit("setDeck", this.#deck.getCards());
        });

        this.#player.on("saveDeck", (deck) => {
            if (!this.logged) {
                this.#player.emit("saveDeck", "Not logged!");
                return;
            }

            if (deck.length != 16) {
                this.#player.emit("saveDeck", "Deck must have 16 cards!");
                return;
            }

            for (let name of deck) {
                if (this.getCardByName(name) == null) {
                    this.#player.emit("saveDeck", "Wrong card data!");
                    return;
                }
            }

            console.log(this.playerId);
            this.#deckDb.update({ owner: this.playerId }, { $set: { owner: this.playerId, cards: deck } }, {}, (err, numUpdated) => {
                this.#deck.setCards(deck);
                this.#player.emit("saveDeck", "Deck Saved!");
            });
        });

        //#endregion

        //#region game logic

        //#endregion

        //#region login
        this.#player.on("register", (login, password) => {
            login = login.trim();
            password = password.trim();

            if (login == "" || password == "") {
                this.#player.emit("loginMessage", "Username and password can not be empty!");
                return;
            }

            const db = new this.#sqlite.Database("./server/data/users.db", this.#sqlite.OPEN_READWRITE, (err) => {
                if (err) console.error("Database users cannot be loaded!");
            });

            db.all(`SELECT * FROM users where username="${login}"`, (err, rows) => {
                if (rows.length != 0) {
                    this.#player.emit("loginMessage", "A user with this login already exists!");
                    return;
                }
                var stmt = db.prepare("INSERT INTO users(username, password) VALUES (?,?)");
                stmt.run(login, password);
                stmt.finalize();

                this.#deckDb.insert({ owner: login, cards: defaultDeck }, (err, newDoc) => {
                    this.#player.emit("loginMessage", "Registered successfully! Now you can login");
                });
            });
            db.close();
        });

        this.#player.on("login", (login, password) => {
            const db = new this.#sqlite.Database("./server/data/users.db", this.#sqlite.OPEN_READWRITE, (err) => {
                if (err) console.error("Database users cannot be loaded!");
            });
            let query = `SELECT * FROM users where username="${login}" and password="${password}"`;
            db.all(query, (err, rows) => {
                if (rows.length == 0) {
                    this.#player.emit("loginMessage", "Wrong login or password!");
                    return;
                }
                this.logged = true;
                this.playerId = rows[0].username;

                this.#deckDb.findOne({ owner: this.playerId }, (err, doc) => {
                    this.#deck.setCards(doc.cards);
                });

                this.#player.emit("login");
            });

            db.close();
        });
        //#endregion
    }

    joinRoom(room) {
        this.room = room;
        if (room.join(this.#player)) {
            if (!room.waiting) {
                this.firstPlayer = false;
                let myTurn = this.firstPlayer == this.room.game.firstPlayerTurn;
                let gems = this.room.game.getGemsPosition();

                this.room.game.gameStarted = true;

                this.#player.emit("startGame", myTurn, gems);
                this.room.getOppositePlayer(this.#player).emit("startGame", !myTurn, gems);
            }
        }
    }

    getCardByName(name) {
        for (let card of cards) {
            if (card.name == name) return card;
        }
        return null;
    }
};
