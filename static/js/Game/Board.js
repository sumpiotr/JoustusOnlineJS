import { directions } from "../Enums/Directions.js";
import BoardItem from "./BoardItem.js";
import Gem from "./Gem.js";
import { enemyHand } from "./Hand.js";
import { hintManager } from "./HintManager.js";

class Board {
    #itemSize = 10;
    #board = [
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, 0, 0, 0, -1, -1],
        [-1, 0, 1, 1, 1, 0, -1],
        [-1, 0, 1, 1, 1, 0, -1],
        [-1, 0, 1, 1, 1, 0, -1],
        [-1, -1, 0, 0, 0, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
    ];
    #cursor = [3, 3];
    #tiles = [];
    #cards = [];
    #selectedCard = null;
    #itemMaterial = `../../assets/art/JoustusBoards/Joustus-3X3.png`;
    #active = false;

    constructor(){
        this.gameObject = new THREE.Object3D()
        this.getPlacedCardData = null
        this.onMove = ()=>{return null}
        this.onEnter = null
    }

    generateBoard(gemsPositions) {
        for (let y = this.#board.length - 1; y >= 0; y--) {
            for (let x = 0; x < this.#board[y].length; x++) {
                if (y == 0 || y == this.#board.length - 1 || x == 0 || x == this.#board[y].length - 1) {
                    this.#tiles.push(null);
                    continue;
                }
                const cube = new BoardItem(this.#itemMaterial, this.#itemSize, x - 1, y - 1);
                cube.position.set(x * this.#itemSize - (this.#board[y].length - 1) * (this.#itemSize / 2), y * this.#itemSize - (this.#board[y].length - 1) * (this.#itemSize / 2), 0);
                this.gameObject.add(cube);
                if (this.#board[y][x] == -1) {
                    this.#tiles.push(null);
                    continue;
                }
                this.#tiles.push(cube);
            }
        }
        this.generateGems(gemsPositions);
        window.addEventListener("keydown", (e) => this.#updateNavigation(e));
    }

    generateGems(gemsPositions) {
        gemsPositions.forEach((gemPosition) => {
            let gemTile = this.#tiles[gemPosition.y * 1 * this.#board.length + gemPosition.x * 1];
            gemTile.containsGem = true;
            const gem = new Gem();
            this.gameObject.add(gem);
            gem.position.set(gemTile.position.x, gemTile.position.y, 10);
        });
    }

    activate(card){
        this.#active = true
        this.#selectedCard = card
        this.gameObject.add(card)
        const tileToPlace = this.#tiles[this.#cursor[1] * this.#board.length + this.#cursor[0]].position
        this.#selectedCard.position.set(tileToPlace.x, tileToPlace.y, 15)
        this.#updateTile(this.#cursor, directions.none);
    }

    #updateNavigation(e) {
        if (this.#active == false) return;
        //38 - arrow up
        if (e.keyCode == 38 && this.#board[this.#cursor[1] - 1][this.#cursor[0]] != -1) {
            let oldCursor = this.#cursor;
            this.#cursor[1] -= 1;
            this.#updateTile(oldCursor, directions.up);
        }
        //40 - arrow down
        else if (e.keyCode == 40 && this.#board[this.#cursor[1] + 1][this.#cursor[0]] != -1) {
            let oldCursor = this.#cursor;
            this.#cursor[1] += 1;
            this.#updateTile(oldCursor, directions.down);
        }
        //37 - arrow left
        else if (e.keyCode == 37 && this.#board[this.#cursor[1]][this.#cursor[0] - 1] != -1) {
            let oldCursor = this.#cursor;
            this.#cursor[0] -= 1;
            this.#updateTile(oldCursor, directions.left);
        }
        //39 - arrow right
        else if (e.keyCode == 39 && this.#board[this.#cursor[1]][this.#cursor[0] + 1] != -1) {
            let oldCursor = this.#cursor;
            this.#cursor[0] += 1;
            this.#updateTile(oldCursor, directions.right);
        }
        //13 - enter
        else if(e.keyCode == 13){
            if(!this.onEnter)return
            let movedCard = this.getPlacedCardData()
            console.log(movedCard)
            this.#active = false
            this.#cards.push(this.#selectedCard)
            let directionVector = this.#getDirectionVector(movedCard.direction);
            this.#tiles[(movedCard.position.y-directionVector.y)*this.#board.length + movedCard.position.x-directionVector.x].card = this.#selectedCard
            console.log(this.#tiles[(movedCard.position.y)*this.#board.length + movedCard.position.x])
            this.onEnter(movedCard.cardId, movedCard.position, movedCard.direction)
        }
    }

    placeCard(cardId, position, direction, isMine) {
        this.#placeCard(cardId, position, direction, isMine)
    }

    #placeCard(cardId, position, direction, isMine) {
        
        let directionVector = this.#getDirectionVector(direction);
        let field = this.#tiles[(position.y-directionVector.y)*this.#board.length + position.x-directionVector.x]
        

        if(!isMine){
            console.log('enemy')
            console.log(direction, (position.y-directionVector.y)*this.#board.length + position.x-directionVector.x)
            const card = enemyHand.takeCard(cardId);
            card.position.y=(this.#board.length - position.y-directionVector.y-1)*10-30
            card.position.x=(position.x-directionVector.x)*10-30
            card.position.z = 15;
            this.#cards.push(card)
            this.gameObject.add(card);
            console.log(card)
            console.log(field.card)
            field.card = card
            console.log(field.card)
            console.log(JSON.stringify(field))
        }

        if (direction == directions.none) return

        let nextField = null
        let x = position.x-directionVector.x;
        let y = position.y-directionVector.y
        let fields = [];


        fields.push(field);

        console.log('before dowhile')

        do {
            console.log('while')
            console.log(directionVector)
            let nextFieldPosition = { x: x + directionVector.x, y: y + directionVector.y };
            x = nextFieldPosition.x
            y = nextFieldPosition.y
            console.log(nextFieldPosition.y*this.#board.length + nextFieldPosition.x)
            nextField = this.#tiles[nextFieldPosition.y*this.#board.length + nextFieldPosition.x]
            fields.push(nextField);
        } while (nextField.card != null);


        console.log(field)
        console.log(this.#tiles)
        console.log(fields)

        for (let i = 0; i < fields.length-1; i++) {
            const card = fields[i].card
            console.log(card)
            card.position.y =  fields[i+1].position.y
            card.position.x = fields[i+1].position.x
            card.position.z = 15;
            //this.#move(fields[i+1].position, card)
        }
        console.log(fields)
        for(let j = fields.length-1; j > 0; j--)
        {
            fields[j].card = fields[j-1].card
        }
        fields[0].card=null
        let toLog = []
        fields.forEach(f => {
            if(f.card)toLog.push(f)
        });
        console.log(toLog)
    }

    #move(to, card){
        new TWEEN.Tween(card.position) // co
        .to({ x: to.x, y: to.y }, 500 ) // do jakiej pozycji, w jakim czasie
        .repeat(0) // liczba powtórzeń
        .easing(TWEEN.Easing.Bounce.Out) // typ easingu (zmiana w czasie)
        .onUpdate(() => { console.log('update') })
        .onComplete(() => { console.log ("koniec animacji") }) // funkcja po zakończeniu animacji
        .start()
    }

    #getDirectionVector(direction){
        let vector = {x: 0, y:0}
        switch(direction){
            case directions.up:
                    vector = {x: 0, y:-1}
                    break;
                case directions.right:
                    vector = {x: 1, y:0}
                    break;
                case directions.down:
                    vector = {x: 0, y:1}
                    break;
                case directions.left:
                    vector = {x: -1, y:0}
                    break;
                default:
                    vector = { x: 0, y: 0 };
                    break;
        }
        return vector
    }

    #updateTile(from, direction) {
        const tileToPlace = this.#tiles[this.#cursor[1] * this.#board.length + this.#cursor[0]];
        this.#selectedCard.position.set(tileToPlace.position.x, tileToPlace.position.y, 15);

        this.getPlacedCardData = () => {
            return { cardId: this.#selectedCard._id, position: { x: from[0], y: from[1] }, direction: direction };
        };
        this.onMove(this.#selectedCard._id, { x: from[0], y: from[1] }, direction);
    }
}

export const board = new Board();
