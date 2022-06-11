class HintManager {
    #hintContainer = null;

    #hintText = null;

    constructor() {
        this.#hintContainer = document.getElementById("hint");
        this.#hintText = document.getElementById("hintText");

        this.#hintContainer.style.display = "none";
    }

    display(hint, type) {
        this.#hintText.textContent = hint;
        switch (type) {
            case hintTypes.error:
                this.#hintText.style.color = "red";
                break;
            default:
                this.#hintText.style.color = "white";
                break;
        }
        this.#hintContainer.style.display = "flex";
    }

    hide() {
        this.#hintContainer.style.display = "none";
        this.#hintText.textContent = "";
    }
}

export const hintManager = new HintManager();

export const hintTypes = {
    normal: 0,
    error: 1,
};
