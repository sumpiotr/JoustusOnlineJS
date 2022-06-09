const imagePath = "../assets/art/JoustusCards/Joustus_1.png";

export class DeckEditor {
    #socket = null;
    #cardsContainer = null;
    #uiManager = null;

    constructor(socket, uiManager) {
        this.#socket = socket;
        this.#uiManager = uiManager;
        this.#cardsContainer = document.getElementById("cardsContainer");

        this.#socket.on("setCards", (cards) => {
            this.setCards(cards);
        });
    }

    getCards() {
        this.#socket.emit("getCards");
    }

    setCards(cards) {
        let i = 1;
        this.#cardsContainer.innerHTML = "";
        for (let card of cards) {
            const cardDiv = document.createElement("div");
            cardDiv.className = "card";
            cardDiv.setAttribute("selectable", "borderHiglight");
            cardDiv.setAttribute("name", i);
            cardDiv.setAttribute("right", i + 1);
            cardDiv.setAttribute("left", i - 1);

            let bottomCardIndex = i + 6;
            while (bottomCardIndex > cards.length) bottomCardIndex--;

            let topCardIndex = i - 6;
            if (topCardIndex <= 0) topCardIndex = 1;

            cardDiv.setAttribute("down", bottomCardIndex);
            cardDiv.setAttribute("up", topCardIndex);
            if (i == 0) cardDiv.setAttribute("first", "");
            cardDiv.onclick = () => {
                console.log(card.name);
            };

            let xOffset = -100 * card.offset.x;
            let yOffset = -100 * card.offset.y;

            const cardImg = document.createElement("img");
            cardImg.setAttribute("src", imagePath);
            cardImg.style.left = xOffset + "%";
            cardImg.style.top = yOffset + "%";

            cardDiv.appendChild(cardImg);

            this.#cardsContainer.appendChild(cardDiv);

            i++;
        }
        this.#uiManager.updateSelectables("deck");
    }
}
