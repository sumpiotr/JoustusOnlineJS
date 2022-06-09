module.exports = class Deck {
    #cards = [];

    #deck = [];
    #discarded = [];

    constructor(cards) {
        this.#cards = [...cards];
        this.#deck = [...this.#cards];
    }

    setCards(cards) {
        this.#cards = [...cards];
        this.#deck = [...this.#cards];
        this.#discarded = [];
    }

    drawCard() {
        if (this.#deck.length == 0) return null;
        const randomIndex = Math.floor(Math.random() * this.#deck.length);
        let card = this.#deck[randomIndex];
        this.#discarded.push(card);
        this.#deck.splice(randomIndex, 1);
        return card;
    }

    reshuffle() {
        this.#deck = [...this.#cards];
        this.#discarded = [];
    }

    getCards() {
        return [...this.#cards];
    }
};
