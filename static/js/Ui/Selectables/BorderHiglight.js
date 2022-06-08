import { Selectable } from "./Selectable.js";

export class BorderHiglight extends Selectable {
    constructor(element) {
        super(element);
    }

    select() {
        this._element.style.borderColor = "red";
    }

    unselect() {
        this._element.style.borderColor = "black";
    }
}
