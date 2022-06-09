import BoardItem from "./BoardItem.js"

class Board{
    #itemSize = 10
    #board = [
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, 0, 0, 0, 0, 0, -1],
        [-1, 0, 1, 1, 1, 0, -1],
        [-1, 0, 1, 1, 1, 0, -1],
        [-1, 0, 1, 1, 1, 0, -1],
        [-1, 0, 0, 0, 0, 0, -1],
        [-1, -1, -1, -1, -1, -1, -1]
    ]
    #cursor = [1,1]
    #tiles = []
    #selected = null

    #frameVerticalGeometry = new THREE.BoxGeometry(2, this.#itemSize, this.#itemSize);
    #frameHorizontalGeometry = new THREE.BoxGeometry(this.#itemSize+4, 2, this.#itemSize);
    #itemMaterial = 0xffffff;
    #graveyardMaterial = 0x000000;
    #boardMaterial = 0x5c422a; 
    #generated = false
    constructor(){
        window.addEventListener("keydown", (e) => this.#updateNavigation(e));
        this.gameObject = new THREE.Object3D()
    }

    generateBoard(){
        for(let y=0; y<this.#board.length; y++){
            for(let x=0; x<this.#board[y].length; x++){
                let material = null
                switch(this.#board[y][x]){
                    case 0:
                        material = this.#graveyardMaterial
                        break;
                    case 1:
                        material = this.#itemMaterial
                        break;
                    default:
                        if(x!=0 && y!=0 && y!= this.#board.length-1)
                        {
                            const frame = new THREE.Mesh(this.#frameVerticalGeometry, new THREE.MeshBasicMaterial({
                                color: this.#boardMaterial,
                                side: THREE.DoubleSide,
                                wireframe: false,
                                transparent: true,
                            }));
                            frame.position.set(x*(this.#itemSize+2) - this.#board[y].length*(this.#itemSize/2) - (this.#itemSize/2)-1, y*(this.#itemSize+2) - this.#board[y].length*(this.#itemSize/2), 0)
                            this.gameObject.add(frame)
                        }
                        else if(x!=0 && y!=0 && x!= this.#board[y].length-1){
                            const horizontalFrame = new THREE.Mesh(this.#frameHorizontalGeometry, new THREE.MeshBasicMaterial({
                                color: this.#boardMaterial,
                                side: THREE.DoubleSide,
                                wireframe: false,
                                transparent: true,
                            }));
                            horizontalFrame.position.set(x*(this.#itemSize+2) - this.#board[y].length*(this.#itemSize/2), y*(this.#itemSize+2) - this.#board[y].length*(this.#itemSize/2)-(this.#itemSize/2)-1, 0)
                            this.gameObject.add(horizontalFrame)
                        }
                        this.#tiles.push(null)
                        continue;
                }
                //board item
                const cube = new BoardItem(material, this.#itemSize)
                cube.position.set(x*(this.#itemSize+2) - this.#board[y].length*(this.#itemSize/2), y*(this.#itemSize+2) - this.#board[y].length*(this.#itemSize/2), 0)
                this.gameObject.add(cube)
                this.#tiles.push(cube)
                //board frame
                const frame = new THREE.Mesh(this.#frameVerticalGeometry, new THREE.MeshBasicMaterial({
                    color: this.#boardMaterial,
                    side: THREE.DoubleSide,
                    wireframe: false,
                    transparent: true,
                }));
                frame.position.set(x*(this.#itemSize+2) - this.#board[y].length*(this.#itemSize/2) -(this.#itemSize/2)-1, y*(this.#itemSize+2) - this.#board[y].length*(this.#itemSize/2), 0)
                this.gameObject.add(frame)
                

                const horizontalFrame = new THREE.Mesh(this.#frameHorizontalGeometry, new THREE.MeshBasicMaterial({
                    color: this.#boardMaterial,
                    side: THREE.DoubleSide,
                    wireframe: false,
                    transparent: true,
                }));
                horizontalFrame.position.set(x*(this.#itemSize+2) - this.#board[y].length*(this.#itemSize/2), y*(this.#itemSize+2) - this.#board[y].length*(this.#itemSize/2)-(this.#itemSize/2)-1, 0)
                this.gameObject.add(horizontalFrame)
            }
        }
        this.#generated = true
    }

    #updateNavigation(e) {
        if (this.#generated == false) return;
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