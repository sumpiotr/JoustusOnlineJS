import BoardItem from "./BoardItem.js"
import Gem from "./Gem.js"

class Board{
    #itemSize = 10
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
    #selected = null

    #frameVerticalGeometry = new THREE.BoxGeometry(2, this.#itemSize, this.#itemSize);
    #frameHorizontalGeometry = new THREE.BoxGeometry(this.#itemSize+4, 2, this.#itemSize);
    #itemMaterial = `../../assets/art/JoustusBoards/Joustus-3X3.png`;
    #boardMaterial =new THREE.MeshBasicMaterial({
        color: 0x5c422a,
        side: THREE.DoubleSide,
        wireframe: false,
        transparent: true,
    })

    constructor(){
        this.gameObject = new THREE.Object3D()
    }

    generateBoard(gemsPositions){
        for(let y=0; y<this.#board.length; y++){
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

    #updateNavigation(e) {
        //if (this.#generated == false) return;
        //38 - arrow up
        if (e.keyCode == 38 && this.#board[this.#cursor[1]+1][this.#cursor[0]]!=-1) {
            this.#cursor[1]+=1
            this.#updateTile()
        } 
        //40 - arrow down
        else if (e.keyCode == 40 && this.#board[this.#cursor[1]-1][this.#cursor[0]]!=-1) {
            this.#cursor[1]-=1
            this.#updateTile()
        } 
        //37 - arrow left
        else if (e.keyCode == 37 && this.#board[this.#cursor[0]-1][this.#cursor[0]]!=-1) {
            this.#cursor[0]-=1
            this.#updateTile()
        } 
        //39 - arrow right
        else if (e.keyCode == 39  && this.#board[this.#cursor[0]+1][this.#cursor[0]]!=-1) {
            this.#cursor[0]+=1
            this.#updateTile()
        }
    }

    //to delete and replace with tile class object method
    #updateTile(){
        if(this.#selected!=null)
            this.#selected.changeColorToOrigin()
        this.#selected = this.#tiles[this.#cursor[1]*(this.#board.length) + this.#cursor[0]]
        this.#selected.changeColor(0xff0000)
    }
}

export const board = new Board()