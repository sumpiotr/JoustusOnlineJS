import { uiManager } from "./Ui/UiManager.js";
import { gameManager } from "./Game/GameManager.js";

const socket = io();

//UI init
uiManager.register("mainMenu");
uiManager.display("mainMenu");

uiManager.setOnSelectableClick("mainMenu", "tutorialButton", () => {
    window.open("https://www.yachtclubgames.com/blog/joustus-instruction-manual", "_blank");
});

//do usunięcia, tymczasowe
uiManager.setOnSelectableClick('mainMenu', 'publicGameButton', ()=>{
    uiManager.hide('mainMenu')
})

//Game init
gameManager.initCamera('mainCamera')
gameManager.setCamera('mainCamera')

gameManager.initScene('myScene1')
gameManager.setFocus('myScene1')

gameManager.startRenderer()