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
    #geometry = new THREE.BoxGeometry(this.#itemSize, this.#itemSize, this.#itemSize);
    #frameVerticalGeometry = new THREE.BoxGeometry(2, this.#itemSize, this.#itemSize);
    #frameHorizontalGeometry = new THREE.BoxGeometry(this.#itemSize+4, 2, this.#itemSize);
    #itemMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        wireframe: false
    });
    #graveyardMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.DoubleSide,
        wireframe: false,
        transparent: true,
    });
    #boardMaterial = new THREE.MeshBasicMaterial({
        color: 0x5c422a,
        side: THREE.DoubleSide,
        wireframe: false,
        transparent: true,
    }); 
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
                            const frame = new THREE.Mesh(this.#frameVerticalGeometry, this.#boardMaterial);
                            frame.position.set(x*(this.#itemSize+2) - this.#board[y].length*(this.#itemSize/2) - (this.#itemSize/2)-1, y*(this.#itemSize+2) - this.#board[y].length*(this.#itemSize/2), 0)
                            this.gameObject.add(frame)
                        }
                        else if(x!=0 && y!=0 && x!= this.#board[y].length-1){
                            const horizontalFrame = new THREE.Mesh(this.#frameHorizontalGeometry, this.#boardMaterial);
                            horizontalFrame.position.set(x*(this.#itemSize+2) - this.#board[y].length*(this.#itemSize/2), y*(this.#itemSize+2) - this.#board[y].length*(this.#itemSize/2)-(this.#itemSize/2)-1, 0)
                            this.gameObject.add(horizontalFrame)
                        }
                        continue;
                }
                //this.#board item
                const cube = new THREE.Mesh(this.#geometry, material);
                cube.position.set(x*(this.#itemSize+2) - this.#board[y].length*(this.#itemSize/2), y*(this.#itemSize+2) - this.#board[y].length*(this.#itemSize/2), 0)
                //this.#board frame
                const frame = new THREE.Mesh(this.#frameVerticalGeometry, this.#boardMaterial);
                frame.position.set(x*(this.#itemSize+2) - this.#board[y].length*(this.#itemSize/2) -(this.#itemSize/2)-1, y*(this.#itemSize+2) - this.#board[y].length*(this.#itemSize/2), 0)
                this.gameObject.add(frame)
                this.gameObject.add(cube)

                const horizontalFrame = new THREE.Mesh(this.#frameHorizontalGeometry, this.#boardMaterial);
                horizontalFrame.position.set(x*(this.#itemSize+2) - this.#board[y].length*(this.#itemSize/2), y*(this.#itemSize+2) - this.#board[y].length*(this.#itemSize/2)-(this.#itemSize/2)-1, 0)
                this.gameObject.add(horizontalFrame)
            }
        }
        this.#generated = true
    }

    #updateNavigation(e) {
        // if (this.#activeUi == null) return;

        // //38 - arrow up
        // if (e.keyCode == 38) {
        //     this.#activeUi.selectedIndex -= 1;
        // } else if (e.keyCode == 40) {
        //     //40 - arrow down
        //     this.#activeUi.selectedIndex += 1;
        // } //13 - enter
        // else if (e.keyCode == 13) {
        //     this.#activeUi.selectableClicked();
        // } //27 - esc
        // else if (e.keyCode == 27) {
        //     this.back();
        // }
    }
}

export const board = new Board()