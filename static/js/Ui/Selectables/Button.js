import { Selectable } from "./Selectable.js";

export class Button extends Selectable {
    #button = null;

    constructor(element) {
        super(element);

        this.#button = this._element.querySelector(`button`);
    }

    select() {
        this.#button.style.backgroundColor = "orange";
    }

    unselect() {
        this.#button.style.backgroundColor = "white";
    }
}
