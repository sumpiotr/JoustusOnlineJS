import { uiManager } from "./Ui/UiManager.js";

const socket = io();

uiManager.register("mainMenu");
uiManager.display("mainMenu");

uiManager.setOnSelectableClick("mainMenu", "tutorialButton", () => {
    window.open("https://www.yachtclubgames.com/blog/joustus-instruction-manual", "_blank");
});
