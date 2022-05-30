import { Selectable } from "./Selectable.js";

export class MenuButton extends Selectable {
    #selectionImage = null;

    constructor(element) {
        super(element);

        this.#selectionImage = this._element.querySelector(`[selectionImage]`);
    }

    select() {
        this.#selectionImage.style.display = "block";
    }

    unselect() {
        this.#selectionImage.style.display = "none";
    }
}
