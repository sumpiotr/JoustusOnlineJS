const imagePath = "../assets/art/JoustusCards/Joustus_1.png";

export class DeckEditor {
    #socket = null;
    #cardsContainer = null;
    #uiManager = null;
    #deckContainer = null;
    #deckInfo = null;

    #cards = [];
    #deck = [];

    constructor(socket, uiManager) {
        this.#socket = socket;
        this.#uiManager = uiManager;
        this.#cardsContainer = document.getElementById("cardsContainer");
        this.#deckContainer = document.getElementById("deckSelection");
        this.#deckInfo = document.getElementById("deckInfo");

        this.#socket.on("setCards", (cards) => {
            this.#cards = cards;
            this.setCards(cards);
        });

        this.#socket.on("setDeck", (cardsNames) => {
            this.#deck = cardsNames;
            this.setDeck();
        });

        this.#socket.on("saveDeck", (message) => {
            this.#deckInfo.textContent = message;
        });
    }

    saveDeck() {
        this.#socket.emit("saveDeck", this.#deck);
    }

    getCards() {
        this.#deckInfo.textContent = "";
        this.#socket.emit("getCards");
    }

    getDeck() {
        this.#socket.emit("getDeck");
    }

    setCards(cards) {
        let i = 1;
        this.#cardsContainer.innerHTML = "";

        for (let card of cards) {
            const cardDiv = document.createElement("div");
            cardDiv.className = "card";
            cardDiv.setAttribute("selectable", "borderHiglight");
            cardDiv.setAttribute("name", i);
            cardDiv.setAttribute("left", i - 1);

            if (i % 6 == 0 || i == cards.length) {
                cardDiv.setAttribute("right", "deck1");
            } else {
                cardDiv.setAttribute("right", i + 1);
            }

            let bottomCardIndex = i + 6;
            while (bottomCardIndex > cards.length) bottomCardIndex--;

            let topCardIndex = i - 6;
            if (topCardIndex <= 0) topCardIndex = 1;

            if (cards.length - i < 6) {
                bottomCardIndex = "saveDeck";
            }

            cardDiv.setAttribute("down", bottomCardIndex);
            cardDiv.setAttribute("up", topCardIndex);
            if (i == 0) cardDiv.setAttribute("first", "");
            cardDiv.onclick = () => {
                if (this.#deck.length < 16) {
                    this.#deck.push(card.name);
                    this.setDeck();
                }
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

    setDeck() {
        this.#deckContainer.innerHTML = "";

        let uniqeCards = [...new Set(this.#deck)];

        const counts = {};
        this.#deck.forEach(function (value) {
            counts[value] = (counts[value] || 0) + 1;
        });

        let i = 1;
        for (let name of uniqeCards) {
            const card = this.#getCardByName(name);
            const container = document.createElement("div");
            container.className = "cardPreview";
            container.setAttribute("selectable", "borderHiglight");
            container.setAttribute("name", `deck${i}`);

            if (i == uniqeCards.length) {
                container.setAttribute("down", `saveDeck`);
            } else {
                container.setAttribute("down", `deck${i + 1}`);
            }

            container.setAttribute("up", `deck${i - 1}`);
            container.setAttribute("left", "1");
            container.setAttribute("defaultBorder", "white");

            container.onclick = () => {
                this.#deck.splice(this.#deck.indexOf(name), 1);
                this.setDeck();
            };

            const cardDiv = document.createElement("div");
            cardDiv.className = "card";

            let xOffset = -100 * card.offset.x;
            let yOffset = -100 * card.offset.y;

            const cardImg = document.createElement("img");
            cardImg.setAttribute("src", imagePath);
            cardImg.style.left = xOffset + "%";
            cardImg.style.top = yOffset + "%";

            const nameDiv = document.createElement("div");
            nameDiv.className = "name";
            nameDiv.textContent = `${counts[name]}x ${card.name}`;

            cardDiv.appendChild(cardImg);

            container.appendChild(cardDiv);
            container.appendChild(nameDiv);

            this.#deckContainer.appendChild(container);
            i++;
        }
        this.#uiManager.updateSelectables("deck");
    }

    #getCardByName(name) {
        for (let card of this.#cards) {
            if (name == card.name) return card;
        }
        return null;
    }
}
