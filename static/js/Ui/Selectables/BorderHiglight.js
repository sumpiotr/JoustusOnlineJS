import { Selectable } from "./Selectable.js";

export class BorderHiglight extends Selectable {
    #defaultColor = "black";

    constructor(element) {
        super(element);
        let color = this._element.getAttribute("defaultBorder");
        if (color != null) this.#defaultColor = color;
    }

    select() {
        this._element.style.borderColor = "red";
    }

    unselect() {
        this._element.style.borderColor = this.#defaultColor;
    }
}
