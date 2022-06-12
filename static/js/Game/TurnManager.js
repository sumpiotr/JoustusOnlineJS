class TurnManager {
    #turnContainer = null;
    #turnText = null;

    constructor() {
        this.#turnContainer = document.getElementById("turn");
        this.#turnText = document.getElementById("turnText");

        this.#turnContainer.style.display = "none";
    }

    display() {
        this.#turnContainer.style.display = "block";
    }

    changeTurn(my) {
        if (my) {
            this.#turnText.style.color = "white";
            this.#turnText.textContent = "Your Turn";
        } else {
            this.#turnText.style.color = "red";
            this.#turnText.textContent = "Enemy Turn";
        }
    }
}

export const turnManager = new TurnManager();
