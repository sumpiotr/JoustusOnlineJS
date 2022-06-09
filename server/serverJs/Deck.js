module.exports = class Deck {
    #cards = [];
    #discarded = [];

    constructor(cards) {
        this.#cards = [...cards];
    }

    setCards(cards) {
        this.#cards = [...cards];
        this.#discarded = [];
    }

    drawCard() {
        if (this.#cards.length == 0) return null;
        const randomIndex = Math.floor(Math.random() * this.#cards.length);
        let card = this.#cards[randomIndex];
        this.#discarded.push(card);
        this.#cards.splice(randomIndex, 1);
        return card;
    }

    reshuffle() {
        for (let card of this.#discarded) {
            this.#cards.push(card);
        }
        this.#discarded = [];
    }
};
