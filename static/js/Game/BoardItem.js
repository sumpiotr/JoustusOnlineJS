class BoardItem extends THREE.Mesh{
    #color = 0x000000
    constructor(color, size){
        let geometry = new THREE.BoxGeometry(size, size, size);
        let material = new THREE.MeshBasicMaterial({
            color: color,
            side: THREE.DoubleSide,
            wireframe: false,
            transparent: true,
        })
        super(geometry, material)
        this.#color = color
    }

    //uses hex
    changeColor(color){
        this.material.color.setHex(color)
    }

    changeColorToOrigin(){
        this.material.color.setHex(this.#color)
    }
}

export default BoardItem