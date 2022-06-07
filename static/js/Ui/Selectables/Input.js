import { Selectable } from "./Selectable.js";

export class Input extends Selectable {
    #input = null;

    constructor(element) {
        super(element);

        this.#input = this._element.querySelector(`input`);
    }

    getValue() {
        return this.#input.value;
    }

    select() {
        this.#input.focus();
    }

    unselect() {
        this.#input.blur();
    }
}
