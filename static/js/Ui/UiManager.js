import { Ui } from "./Ui.js";
import { directions } from "../Enums/Directions.js";
class UiManager {
    #ui = {};
    #uiListeners = {};

    #activeUi = null;

    #previousUi = null;

    constructor() {
        window.addEventListener("keydown", (e) => this.#updateNavigation(e));
    }

    register(id) {
        this.#ui[id] = new Ui(id);
        this.#uiListeners[id] = () => {};
    }

    display(name) {
        this.hideAll();
        this.#uiListeners[name]();
        this.#ui[name].display();
        this.#previousUi = this.#activeUi;
        this.#activeUi = this.#ui[name];
    }

    hide(name) {
        this.#ui[name].hide();
        this.#activeUi = null;
    }

    hideAll() {
        for (const [key, value] of Object.entries(this.#ui)) {
            value.hide();
        }
    }

    registerOnOpenListener(name, func) {
        this.#uiListeners[name] = func;
    }

    #updateNavigation(e) {
        if (this.#activeUi == null) return;

        //38 - arrow up
        if (e.keyCode == 38) {
            this.#activeUi.navigate(directions.up);
        } else if (e.keyCode == 40) {
            //40 - arrow down
            this.#activeUi.navigate(directions.down);
        } //39 - right arrow
        else if (e.keyCode == 39) {
            this.#activeUi.navigate(directions.right);
        } //37 - left arrow
        else if (e.keyCode == 37) {
            this.#activeUi.navigate(directions.left);
        } //13 - enter
        else if (e.keyCode == 13) {
            this.#activeUi.selectableClicked();
        } //27 - esc
        else if (e.keyCode == 27) {
            this.back();
        }
    }

    back() {
        if (this.#previousUi != null) {
            this.hideAll();
            this.#previousUi.display();
            this.#activeUi = this.#previousUi;
            this.#previousUi = null;
        }
    }

    getSelectableValue(uiId, buttonName) {
        return this.#ui[uiId].getSelectableValue(buttonName);
    }

    setOnSelectableClick(uiId, buttonName, func) {
        this.#ui[uiId].setOnSelectableClick(buttonName, func);
    }

    updateSelectables(name) {
        this.#ui[name].updateSelectables();
    }
}

export const uiManager = new UiManager();
