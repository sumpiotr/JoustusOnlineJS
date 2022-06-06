import { uiManager } from "./Ui/UiManager.js";
import { gameManager } from "./Game/GameManager.js";

const socket = io();

//UI init
uiManager.register("mainMenu");
uiManager.register("waitingScreen");
uiManager.register("privateGame");
uiManager.display("mainMenu");

uiManager.setOnSelectableClick("mainMenu", "tutorialButton", () => {
    window.open("https://www.yachtclubgames.com/blog/joustus-instruction-manual", "_blank");
});

uiManager.setOnSelectableClick("mainMenu", "publicGameButton", () => {
    socket.emit("createRoom", true, "publicGame", "");
});

uiManager.setOnSelectableClick("mainMenu", "privateGameButton", () => {
    uiManager.display("privateGame");
});

//sockets
socket.on("createRoom", (publicRoom, err) => {
    if (publicRoom) {
        uiManager.display("waitingScreen");
    }
});

socket.on("startGame", () => {
    //start game
    uiManager.hideAll();
});

//Game init
gameManager.initCamera("mainCamera");
gameManager.setCamera("mainCamera");

gameManager.initScene("myScene1");
gameManager.setFocus("myScene1");

gameManager.startRenderer();
