import { MenuButton } from "./MenuButton.js";

export class SelectablesFactory {
    static getSelectable(name, element) {
        switch (name) {
            case "menuButton":
                return new MenuButton(element);
            default:
                return null;
        }
    }
}
