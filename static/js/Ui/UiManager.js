import { Ui } from "./Ui.js";

class UiManager {
    #ui = {};

    #activeUi = null;

    constructor() {
        window.addEventListener("keydown", (e) => this.#updateNavigation(e));
    }

    register(id) {
        this.#ui[id] = new Ui(id);
    }

    display(name) {
        this.hideAll();
        this.#ui[name].display();
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

    #updateNavigation(e) {
        if (this.#activeUi == null) return;
        if (e.keyCode == "W".charCodeAt(0)) {
            this.#activeUi.selectedIndex -= 1;
        } else if (e.keyCode == "S".charCodeAt(0)) {
            this.#activeUi.selectedIndex += 1;
        } //13 is ascii code of enter
        else if (e.keyCode == 13) {
            this.#activeUi.selectableClicked();
        }
    }

    setOnSelectableClick(uiId, buttonName, func) {
        this.#ui[uiId].setOnSelectableClick(buttonName, func);
    }
}

export const uiManager = new UiManager();
