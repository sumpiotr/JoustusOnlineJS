import { uiManager } from "./Ui/UiManager.js";
import { gameManager } from "./Game/GameManager.js";
import { board } from "./Game/Board.js";
import { DeckEditor } from "./DeckEditor.js";
import { hintManager, hintTypes } from "./Game/HintManager.js";
import Card from "./Game/Card.js";
import { myHand, enemyHand } from "./Game/Hand.js";
import { directions } from "./Enums/Directions.js";
import { turnManager } from "./Game/TurnManager.js";

const socket = io();

const deckEditor = new DeckEditor(socket, uiManager);

//UI init
uiManager.register("mainMenu");
uiManager.register("login");
uiManager.register("waitingScreen");
uiManager.register("privateGame");
uiManager.register("deck");
uiManager.display("mainMenu");

const privateGameErrorInfo = document.getElementById("privateGameErrorInfo");
const loginInfo = document.getElementById("loginInfo");
const loginButtonText = document.getElementById("loginButtonText");

//main menu
uiManager.setOnSelectableClick("mainMenu", "tutorialButton", () => {
    window.open("https://www.yachtclubgames.com/blog/joustus-instruction-manual", "_blank");
});

uiManager.setOnSelectableClick("mainMenu", "publicGameButton", () => {
    socket.emit("createRoom", true, "publicGame", "");
});

uiManager.setOnSelectableClick("mainMenu", "privateGameButton", () => {
    uiManager.display("privateGame");
});

uiManager.setOnSelectableClick("mainMenu", "loginButton", () => {
    socket.emit("isLogged");
});

//private Game
uiManager.setOnSelectableClick("privateGame", "createGame", () => {
    let name = uiManager.getSelectableValue("privateGame", "roomName");
    let password = uiManager.getSelectableValue("privateGame", "roomPassword");

    socket.emit("createRoom", false, name, password);
});

uiManager.setOnSelectableClick("privateGame", "joinGame", () => {
    let name = uiManager.getSelectableValue("privateGame", "roomName");
    let password = uiManager.getSelectableValue("privateGame", "roomPassword");

    socket.emit("joinRoom", name, password);
});

//login

uiManager.setOnSelectableClick("login", "loginButton", () => {
    loginInfo.textContent = "";
    let login = uiManager.getSelectableValue("login", "login");
    let password = uiManager.getSelectableValue("login", "password");
    console.log(login, password);
    socket.emit("login", login, password);
});

uiManager.setOnSelectableClick("login", "registerButton", () => {
    loginInfo.textContent = "";
    let login = uiManager.getSelectableValue("login", "login");
    let password = uiManager.getSelectableValue("login", "password");
    socket.emit("register", login, password);
});

//decks

uiManager.registerOnOpenListener("deck", () => {
    deckEditor.getCards();
    deckEditor.getDeck();
});

uiManager.setOnSelectableClick("deck", "cancelDeck", () => {
    deckEditor.getDeck();
});

uiManager.setOnSelectableClick("deck", "saveDeck", () => {
    deckEditor.saveDeck();
});

//sockets
socket.on("createRoom", (err) => {
    if (err != "") {
        privateGameErrorInfo.textContent = err;
        return;
    } else {
        uiManager.display("waitingScreen");
    }
});

//login
socket.on("isLogged", (logged) => {
    if (logged) {
        uiManager.display("deck");
    } else {
        uiManager.display("login");
    }
});

socket.on("login", () => {
    console.log("a");
    loginButtonText.textContent = "Edit Decks";
    uiManager.back();
});

socket.on("loginMessage", (message) => {
    loginInfo.textContent = message;
});

socket.on("endGame", (winner) => {
    console.log(winner);
    board.deactivate();
    if (winner === 0) {
        hintManager.display("Draw!", hintTypes.normal);
    } else if (winner === false) {
        hintManager.display("You lose!", hintTypes.normal);
    } else {
        hintManager.display("You win!", hintTypes.normal);
    }
});

//gems positions is table of {x: int, y:int} objects; myTurn is bolean
socket.on("startGame", (myTurn, gemsPositions) => {
    //start game
    uiManager.hideAll();
    board.generateBoard(gemsPositions);
    board.onMove = (cardId, position, direction) => {
        socket.emit("canPlaceCard", cardId, position, direction);
        board.getPlacedCardData = () => {
            return { cardId: cardId, position: position, direction: direction };
        };
    };
    myHand.generateHand();
    enemyHand.generateHand();
    turnManager.display();
    turnManager.changeTurn(myTurn);
    if (myTurn)
        myHand.activate((card) => {
            board.activate(card);
        });
});

socket.on("drawCard", (id, card, isMine) => {
    isMine ? myHand.addCard(card, id) : enemyHand.addCard(card, id);
});

socket.on("canPlaceCard", (data) => {
    console.log(data.value, data.message);
    if (data.message == "") {
        hintManager.hide();
    }
    if (data.value) {
        board.showingPreMove = true;
        board.showPreMove();
        board.onEnter = (cardId, position, direction) => {
            socket.emit("placeCard", cardId, position, direction);
        };
    } else {
        if (data.message != "") {
            console.log("display");
            hintManager.display(data.message, hintTypes.error);
        }
        board.onEnter = null;
        board.showingPreMove = false;
    }
});

socket.on("placeCard", (cardId, position, direction, my) => {
    board.placeCard(cardId, position, direction, my);
    turnManager.changeTurn(!my);
    if (!my) {
        myHand.activate((card) => {
            board.activate(card);
        });
    }
});

//Game init
gameManager.initScene("myScene1");
gameManager.setFocus("myScene1");
gameManager.initCamera("mainCamera", 75, new THREE.Vector3(0, 0, 100));
gameManager.setCamera("mainCamera");
gameManager.cameraFocusOnScene();

gameManager.addToScene("board", board.gameObject);
gameManager.addToScene("myHand", myHand.gameObject);
gameManager.addToScene("enemyHand", enemyHand.gameObject);
myHand.gameObject.position.x = -45;
enemyHand.gameObject.position.x = 45;

gameManager.startRenderer();
