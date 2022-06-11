import Card from "./Card.js"

class Hand {
    #cursor = [0]
    #cards = []
    #selected = null

    constructor(){
        this.gameObject = new THREE.Object3D()
    }

    generateHand(cards){
        for(let y=0; y<this.#board.length; y++){
        }
        this.generateGems(gemsPositions)
        window.addEventListener("keydown", (e) => this.#updateNavigation(e));
    }

    generateGems(gemsPositions){
        gemsPositions.forEach(gemPosition => {
            let gemTile = this.#tiles[gemPosition.y*1*(this.#board.length) + gemPosition.x*1]
            gemTile.containsGem=true
            const gem = new Gem()
            this.gameObject.add(gem)
            gem.position.set(gemTile.position.x, gemTile.position.y, 10)
        });
    }

    #updateNavigation(e) {
        //if (this.#generated == false) return;
        //38 - arrow up
        if (e.keyCode == 38 && this.#board[this.#cursor[1] + 1][this.#cursor[0]] != -1) {
            this.#cursor[1] += 1;
            this.#updateTile();
        }
        //40 - arrow down
        else if (e.keyCode == 40 && this.#board[this.#cursor[1] - 1][this.#cursor[0]] != -1) {
            this.#cursor[1] -= 1;
            this.#updateTile();
        }
    }


}

export const myHand = new Hand('player');
export const enemyHand = new Hand('enemy')
