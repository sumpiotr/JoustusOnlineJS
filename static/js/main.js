import { uiManager } from "./Ui/UiManager.js";

const socket = io();

uiManager.register("mainMenu");
uiManager.display("mainMenu");
