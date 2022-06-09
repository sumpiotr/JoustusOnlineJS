class GameManager {
    #scenes = {};
    #activeScene = null;
    #cameras = {};
    #activeCamera = null;
    #renderer = null;
    #objects = {};

    constructor() {
        this.#renderer = new THREE.WebGLRenderer();
        document.getElementById("root").appendChild(this.#renderer.domElement);
        this.#renderer.setClearColor(0x0066ff);
        this.#renderer.setSize(window.innerWidth, window.innerHeight);
        window.addEventListener("resize", () => {
            this.#activeCamera.aspect = window.innerWidth / window.innerHeight;
            this.#activeCamera.updateProjectionMatrix();
            this.#renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    //#region scene functions
    initScene(id) {
        this.#scenes[id] = new THREE.Scene();
    }

    setFocus(id) {
        this.#activeScene = this.#scenes[id];
        if (this.#activeCamera) this.#activeCamera.lookAt(this.#activeScene.position);
    }

    getCurrentScene() {
        return this.#activeScene;
    }

    addToScene(id, mesh) {
        this.#objects[id] = mesh;
        this.#activeScene.add(this.#objects[id]);
    }

    //#endregion

    initCamera(id, fov, position) {
        this.#cameras[id] = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.#cameras[id].position.set(position.x, position.y, position.z);
        this.#activeScene.add(this.#cameras[id]);
    }

    setCamera(id) {
        this.#activeCamera = this.#cameras[id];
    }

    cameraFocusOnScene() {
        this.#activeCamera.lookAt(this.#activeScene.position);
    }

    setActiveCameraPosition(position) {
        this.#activeCamera.position = position;
    }

    setCameraPosition(id, position) {
        this.#cameras[id].position = position;
    }

    startRenderer() {
        requestAnimationFrame(() => {
            this.startRenderer();
        });
        this.#renderer.render(this.#activeScene, this.#activeCamera);
    }
}

export const gameManager = new GameManager();
