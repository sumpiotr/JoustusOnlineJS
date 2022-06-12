module.exports = class Card {
    constructor(cardData, position, firstPlayer) {
        this.arrows = cardData.arrows;
        this.position = position;
        this.firstPlayer = firstPlayer;
    }
};
