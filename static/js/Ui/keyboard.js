class Keyboard {
    #key = {
        A: "A".charCodeAt(0),
        B: "B".charCodeAt(0),
        C: "C".charCodeAt(0),
        D: "D".charCodeAt(0),
        E: "E".charCodeAt(0),
        F: "F".charCodeAt(0),
        G: "G".charCodeAt(0),
        H: "H".charCodeAt(0),
        I: "I".charCodeAt(0),
        J: "J".charCodeAt(0),
        K: "K".charCodeAt(0),
        L: "L".charCodeAt(0),
        M: "M".charCodeAt(0),
        N: "N".charCodeAt(0),
        O: "O".charCodeAt(0),
        P: "P".charCodeAt(0),
        Q: "Q".charCodeAt(0),
        R: "R".charCodeAt(0),
        S: "S".charCodeAt(0),
        T: "T".charCodeAt(0),
        U: "U".charCodeAt(0),
        V: "V".charCodeAt(0),
        W: "W".charCodeAt(0),
        X: "X".charCodeAt(0),
        Y: "Y".charCodeAt(0),
        Z: "Z".charCodeAt(0),
        Space: 32,
        Escape: 27,
    };

    #pressedKeysDown = [];
    #pressedKeys = [];
    #isKeyPressed = false;

    constructor() {
        window.addEventListener("keydown", (e) => this.#setPressedKeys(e));
        window.addEventListener("keyup", (e) => this.#resetPressedKeys(e));
    }

    get key() {
        return this.#key;
    }

    #setPressedKeys(e) {
        let setNewKey = true;
        for (let key in this.#pressedKeys) {
            if (this.#pressedKeys[key] == e.keyCode) {
                setNewKey = false;
                break;
            }
        }
        if (setNewKey) this.#pressedKeys[this.#pressedKeys.length] = e.keyCode;
        setNewKey = true;
        for (let key in this.#pressedKeysDown) {
            if (this.#pressedKeysDown[key] == e.keyCode) {
                setNewKey = false;
                break;
            }
        }
        if (setNewKey) this.#pressedKeysDown[this.#pressedKeysDown.length] = e.keyCode;
    }

    #resetPressedKeys(e) {
        for (let key in this.#pressedKeysDown) {
            if (e.keyCode == this.#pressedKeysDown[key]) {
                this.#pressedKeysDown.splice(key, 1);
                this.#isKeyPressed = false;
                break;
            }
        }

        for (let key in this.#pressedKeys) {
            if (this.#pressedKeys[key] == e.keyCode) {
                this.#pressedKeys.splice(key, 1);
                break;
            }
        }
    }

    getKeyDown(keyCode) {
        if (this.#isKeyPressed) return false;
        for (let key in this.#pressedKeysDown) {
            if (keyCode == this.#pressedKeysDown[key]) {
                this.#isKeyPressed = true;
                return true;
            }
        }
        return false;
    }

    getKey(keyCode) {
        for (let key in this.#pressedKeys) {
            if (this.#pressedKeys[key] == keyCode) return true;
        }
        return false;
    }
}

export const keyboard = new Keyboard();
