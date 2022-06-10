const fieldType = {
    none: -1,
    graveyard: 0,
    normal: 1,
};

class Field {
    constructor(type, x, y) {
        this.card = null;
        this.gem = false;
        this.type = type;
        this.position = { x: x, y: y };
    }
}

module.exports = { Field, fieldType };
