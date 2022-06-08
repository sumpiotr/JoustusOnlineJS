module.exports = class Client {
    #player = null;
    #sqlite = null;

    constructor(player, sqlite) {
        this.#player = player;
        this.#sqlite = sqlite;
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
                this.#player.emit("loginMessage", "Registered successfully! Now you can login");
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
                this.playerId = rows[0].id;
                console.log(this.playerId);
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
