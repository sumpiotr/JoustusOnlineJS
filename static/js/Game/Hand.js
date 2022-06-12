import Card from "./Card.js";

class Hand {
    #cursor = 1;
    #selected = null;
    #name = "";
    #active = false;
    #onEnter = () => {
        console.log("enter pressed");
    };

    constructor(name) {
        this.gameObject = new THREE.Object3D();
        this.#name = name;
        this.cards = [null, null, null];
    }

    generateHand() {
        this.refreshHand();
        window.addEventListener("keydown", (e) => this.#updateNavigation(e));
    }

    refreshHand() {
        for (let i = 0; i < this.cards.length; i++) {
            if (this.cards[i] == null) continue;
            this.cards[i].position.set(0, -((150 - 24) / 6) * (i + 1) + 42, 15);
        }
    }

    addCard(card, index) {
        this.cards[index] =
            this.#name == "player"
                ? new Card(card.offset.x, card.offset.y, card.sheet, "blue", card.directions, index)
                : new Card(card.offset.x, card.offset.y, card.sheet, "red", card.directions, index);
        this.gameObject.add(this.cards[index]);
        this.refreshHand();
    }

    takeCard(index) {
        const card = this.cards[index];
        this.cards[index] = null;
        this.gameObject.remove(card);
        return card;
    }

    activate(onEnter) {
        this.#active = true;
        console.log("my turn");
        this.#onEnter = onEnter;
    }

    #updateNavigation(e) {
        if (this.#active == false || this.#name == "enemy") return;
        //38 - arrow up
        if (e.keyCode == 38 && this.#cursor - 1 > -1) {
            this.#cursor -= 1;
            this.#selectCard();
        }
        //40 - arrow down
        else if (e.keyCode == 40 && this.#cursor + 1 < 3) {
            this.#cursor += 1;
            this.#selectCard();
        }
        //13 - enter
        else if (e.keyCode == 13 && this.#selected) {
            this.#placeCard(this.#selected);
        }
    }

    #placeCard() {
        this.#selected.changeColorToOrigin();
        this.#active = false;
        this.gameObject.remove(this.#selected);
        this.#onEnter(this.#selected);
    }

    #selectCard() {
        if (this.#selected) this.#selected.changeColorToOrigin();
        this.#selected = this.cards[this.#cursor];
        this.#selected.changeColor(0x798394);
    }
}

export const myHand = new Hand("player");
export const enemyHand = new Hand("enemy");
