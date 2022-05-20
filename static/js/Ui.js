class Ui {
    #ui = {};

    constructor() {}

    register(id, name) {
        this.#ui[name] = document.getElementById(id);
    }

    display(name) {
        this.#ui[name].display = this.#ui[name].getAttribute("default-display");
    }

    hide(name) {
        this.#ui[name].display = "none";
    }

    hideAll() {
        for (let screen of this.#ui) {
            screen.style.display = "none";
        }
    }
}
