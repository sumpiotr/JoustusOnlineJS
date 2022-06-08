export class Selectable {
    _element;

    constructor(element) {
        this._element = element;
        this.index = this._element.getAttribute("number");
        this.name = this._element.getAttribute("name");
    }

    getAttribute(name) {
        return this._element.getAttribute(name);
    }

    getValue() {
        return "";
    }

    select() {}

    unselect() {}

    setOnClick(func) {
        this._element.onclick = func;
    }

    onClick() {
        this._element.onclick();
    }
}
