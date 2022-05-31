class GameManager{
    #scenes = {}
    #activeScene = null
    #cameras = {}
    #activeCamera = null
    #renderer = null

    constructor(){
        this.#renderer = new THREE.WebGLRenderer();
    }

    initScene(id){
        this.#scenes[id] = new THREE.Scene();
        console.log(this.#scenes)
    }

    setFocus(id){
        this.#activeScene = this.#scenes[id]
        this.#activeCamera.lookAt(this.#activeScene.position);
    }

    initCamera(fov, position){
        this.#cameras[id] = new THREE.PerspectiveCamera(fov, window.innerWidth/window.innerHeight, 0.1, 10000)
        this.#cameras[id].position = position
    }

    setCamera(id){
        this.#activeCamera = this.#cameras[id]
    }

    setActiveCameraPosition(position){
        this.#activeCamera.position = position
    }

    setCameraPosition(id, position){
        this.#cameras[id].position = position
    }

    startRenderer(){
        requestAnimationFrame(this.startRenderer);
        this.#renderer.render(scene, camera);
    }
}

export const gameManager = new GameManager()