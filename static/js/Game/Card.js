class Card extends THREE.Mesh{
    constructor(){
        let geometry = new THREE.BoxGeometry(10, 10, 1);
        const tex = new THREE.ImageUtils.loadTexture('../../assets/art/JoustusCards/Joustus_1.png');
        tex.repeat.x = 510 / 2550;
        tex.repeat.y = 510 / 3056;
        tex.offset.x = 0* tex.repeat.x;
        tex.offset.y = (5-0)* tex.repeat.y;

        let material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            wireframe: false,
            transparent: true,
            color: 0xffffff,
            map:tex
        })
        super(geometry, material)
        this.color = this.color
    }
}

export default Card