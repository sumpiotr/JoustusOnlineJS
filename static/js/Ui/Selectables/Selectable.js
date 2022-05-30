export class Selectable {
    _element;

    constructor(element) {
        this._element = element;
        this.index = this._element.getAttribute("number");
    }

    select() {}

    unselect() {}

    setOnClick(func) {
        this._element.onClick = func;
    }

    onClick() {
        this._element.onClick();
    }
}
