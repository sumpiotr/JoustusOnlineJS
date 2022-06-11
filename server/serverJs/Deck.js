module.exports = class Deck {
    #cards = [];

    #deck = [];
    #discarded = [];

    constructor(cards) {
        this.#cards = [...cards];
        this.#deck = [...this.#cards];
        this.hand = [null, null, null];
    }

    setCards(cards) {
        this.#cards = [...cards];
        this.#deck = [...this.#cards];
        this.#discarded = [];
    }

    drawCard() {
        if (this.#deck.length == 0) return null;

        let cardIndex = -1;
        for (let index in this.hand) {
            if (this.hand[index] == null) {
                cardIndex = index;
                break;
            }
        }
        if (cardIndex == -1) return null;

        const randomIndex = Math.floor(Math.random() * this.#deck.length);
        let card = this.#deck[randomIndex];
        this.#discarded.push(card);
        this.#deck.splice(randomIndex, 1);

        this.hand[cardIndex] = card;
        return { card: card, id: cardIndex };
    }

    discardCard(id) {
        this.#discarded.push(this.hand[id]);
        this.hand[id] = null;
    }

    reshuffle() {
        this.#deck = [...this.#cards];
        this.#discarded = [];
    }

    getCards() {
        return [...this.#cards];
    }
};
