class Gem extends THREE.Mesh{
    constructor(){
        let geometry = new THREE.BoxGeometry(4, 4, 1);
        let tex = new THREE.TextureLoader().load('../../assets/art/JoustusPieces/Joustus-Gems.png')
        tex.repeat.x = 64/ 128;
        tex.repeat.y = 64 / 128;
        tex.offset.x = 0*tex.repeat.x;
        tex.offset.y = 0*tex.repeat.y;
        let material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            wireframe: false,
            transparent: true,
            map:tex
        })
        super(geometry, material)
    }
}

export default Gem