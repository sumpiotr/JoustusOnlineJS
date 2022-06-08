import { SelectablesFactory } from "./Selectables/SelectablesFactory.js";
import { directions } from "../Enums/Directions.js";

export class Ui {
    #selectables = [];
    #selected = null;
    #firstSelectable = null;

    constructor(name) {
        this.element = document.getElementById(name);
        const selectableElements = this.element.querySelectorAll(`[selectable]`);

        for (let selectableElement of selectableElements) {
            this.#selectables.push(SelectablesFactory.getSelectable(selectableElement.getAttribute("selectable"), selectableElement));
        }

        if (this.#selectables.length > 0) {
            this.#firstSelectable = this.#selectables[0];
        }

        for (let selectable of this.#selectables) {
            if (selectable.getAttribute("first") != null) {
                this.#firstSelectable = selectable;
                break;
            }
        }
    }

    display() {
        this.element.style.display = this.element.getAttribute("default-display");
        if (this.#selectables.length > 0) this.selectFirst();
        this.selectFirst();
    }

    hide() {
        this.element.style.display = "none";
        if (this.#selected != null) this.#selected.unselect();
        this.#selected = this.#firstSelectable;
    }

    selectFirst() {
        if (this.#selectables.length == 0 || this.#firstSelectable == null) return;
        if (this.#selected != null) this.#selected.unselect();
        this.#firstSelectable.select();
        this.#selected = this.#firstSelectable;
    }

    setOnSelectableClick(buttonName, func) {
        for (let selectable of this.#selectables) {
            if (selectable.name == buttonName) {
                selectable.setOnClick(func);
            }
        }
    }

    selectableClicked() {
        this.#selected.onClick();
    }

    navigate(direction) {
        let selectable = null;
        let nextName = null;
        switch (direction) {
            case directions.up:
                nextName = this.#selected.getAttribute("up");
                break;
            case directions.right:
                nextName = this.#selected.getAttribute("right");
                break;
            case directions.down:
                nextName = this.#selected.getAttribute("down");
                break;
            case directions.left:
                nextName = this.#selected.getAttribute("left");
                break;
        }

        if (nextName != null) {
            selectable = this.#getSelectableByName(nextName);
            console.log(nextName, selectable);
            if (selectable != null) {
                if (this.#selected != null) this.#selected.unselect();
                selectable.select();
                this.#selected = selectable;
            }
        }
    }

    #getSelectableByName(name) {
        for (let selectable of this.#selectables) {
            if (selectable.name == name) {
                return selectable;
            }
        }
        return null;
    }

    getSelectableValue(buttonName) {
        let selectable = this.#getSelectableByName(buttonName);
        return selectable != null ? selectable.getValue() : "value not found";
    }
}
