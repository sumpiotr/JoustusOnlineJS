class Card extends THREE.Mesh{
    #color = 0xffffff
    constructor(offsetX, offsetY, sheet, color, directions, id){
        let geometry = new THREE.BoxGeometry(8, 8, 1);
        const tex = color=='blue'?new THREE.ImageUtils.loadTexture(`../../assets/art/JoustusCards/Joustus_${sheet}.png`):new THREE.ImageUtils.loadTexture(`../../assets/art/JoustusCards/red-joustus-${sheet}.png`)
        tex.repeat.x = 510 / 2550;
        tex.repeat.y = 510 / 3056;
        tex.offset.x = color=='blue'?offsetX* tex.repeat.x:(4-offsetX)* tex.repeat.x
        tex.offset.y = (5-offsetY)* tex.repeat.y;

        let material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            wireframe: false,
            transparent: true,
            color: 0xffffff,
            map:tex
        })
        super(geometry, material)
        this.position.z = 15
        this.color = color
        this.directions = directions
        this._id = id
    }

    //uses hex
    changeColor(color){
        this.material.color.setHex(color)
    }

    changeColorToOrigin(){
        this.material.color.setHex(this.#color)
    }
}

export default Card