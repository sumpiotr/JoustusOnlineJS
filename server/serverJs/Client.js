const Deck = require("./Deck");
const defaultCards = require("../data/defaultDecks.json").cards;

module.exports = class Client {
    #player = null;
    #sqlite = null;
    #deckDb = null;
    #deck = null;

    constructor(player, sqlite, deckDb) {
        this.#player = player;
        this.#sqlite = sqlite;
        this.#deckDb = deckDb;
        this.#deck = new Deck(defaultCards);
        this.logged = false;
        this.playerId = -1;

        this.setSocket();
    }

    setSocket() {
        this.#player.on("isLogged", () => {
            this.#player.emit("isLogged", this.logged);
        });

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

                this.#deckDb.insert({ owner: login, cards: defaultCards }, function (err, newDoc) {
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
                    this.#deck.setCards(doc);
                });

                this.#player.emit("login");
            });

            db.close();
        });
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
