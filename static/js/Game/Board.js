import { directions } from "../Enums/Directions.js";
import BoardItem from "./BoardItem.js"
import Gem from "./Gem.js"

class Board {
    #itemSize = 10;
    #board = [
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, 0, 0, 0, -1, -1],
        [-1, 0, 1, 1, 1, 0, -1],
        [-1, 0, 1, 1, 1, 0, -1],
        [-1, 0, 1, 1, 1, 0, -1],
        [-1, -1, 0, 0, 0, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1]
    ]
    #cursor = [3,3]
    #tiles = []
    #selectedCard = null
    #itemMaterial = `../../assets/art/JoustusBoards/Joustus-3X3.png`;
    #active = false

    constructor(){
        this.gameObject = new THREE.Object3D()
        this.getPlacedCardData = ()=>{return null}
        this.onMove = ()=>{console.log('getPlacedData')}
        this.onEnter = ()=>{console.log('getPlacedData')}
    }

    generateBoard(gemsPositions){
        for(let y=this.#board.length-1; y>=0; y--){
            for(let x=0; x<this.#board[y].length; x++){
                if(y==0 || y==this.#board.length-1 || x==0 || x==this.#board[y].length-1)
                {
                    this.#tiles.push(null)
                    continue
                }
                const cube = new BoardItem(this.#itemMaterial, this.#itemSize, x-1, y-1)
                cube.position.set(x*(this.#itemSize) - (this.#board[y].length-1)*(this.#itemSize/2), y*(this.#itemSize) - (this.#board[y].length-1)*(this.#itemSize/2), 0)
                this.gameObject.add(cube)
                if(this.#board[y][x]==-1){
                    this.#tiles.push(null)
                    continue
                }
                this.#tiles.push(cube)
            }
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

    activate(card){
        this.#active = true
        this.#selectedCard = card
        this.gameObject.add(card)
        const tileToPlace = this.#tiles[this.#cursor[1] * this.#board.length + this.#cursor[0]].position
        this.#selectedCard.position.set(tileToPlace.x, tileToPlace.y, 15)
    }

    #updateNavigation(e) {
        if (this.#active == false) return;
        //38 - arrow up
        if (e.keyCode == 38 && this.#board[this.#cursor[1] - 1][this.#cursor[0]] != -1) {
            let oldCursor = this.#cursor
            this.#cursor[1] -= 1;
            this.#updateTile(oldCursor, directions.up);
        }
        //40 - arrow down
        else if (e.keyCode == 40 && this.#board[this.#cursor[1] + 1][this.#cursor[0]] != -1) {
            let oldCursor = this.#cursor
            this.#cursor[1] += 1;
            this.#updateTile(oldCursor, directions.down);
        }
        //37 - arrow left
        else if (e.keyCode == 37 && this.#board[this.#cursor[1]][this.#cursor[0]-1] != -1) {
            let oldCursor = this.#cursor
            this.#cursor[0] -= 1;
            this.#updateTile(oldCursor, directions.left);
        }
        //39 - arrow right
        else if (e.keyCode == 39 && this.#board[this.#cursor[1]][this.#cursor[0]+1] != -1) {
            let oldCursor = this.#cursor
            this.#cursor[0] += 1;
            this.#updateTile(oldCursor, directions.right);
        }
        //13 - enter
        else if(e.keyCode == 13){
            if(!this.getPlacedCardData()){
                this.#updateTile(this.#cursor, directions.none);
            }
            else{
                let movedCard = this.getPlacedCardData()
                console.log(movedCard)
                this.onEnter(movedCard.id, movedCard.position, movedCard.direction)
            }
        }
    }

    #updateTile(from, direction) {
        const tileToPlace = this.#tiles[this.#cursor[1] * this.#board.length + this.#cursor[0]]
        this.#selectedCard.position.set(tileToPlace.position.x, tileToPlace.position.y, 15)

        this.getPlacedCardData = ()=>{return{cardId: this.#selectedCard._id, position: {x: from[0],y: (from[1])}, direction: direction}}
        this.onMove(this.#selectedCard._id, {x: from[0],y: (from[1])}, direction)
    }
}

export const board = new Board();
