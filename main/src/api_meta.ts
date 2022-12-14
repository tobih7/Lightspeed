export const COLOR = {
    red: '#A11',
    green: '#1A1'
}

// TODO maybe make this class itself awaitable
const State = new class {
    promise: Promise<void>;
    private resolve: (value?: unknown) => void;
    private _data = { // this object stores the servers state
        1: { color: COLOR.green },
        2: { color: COLOR.green },
        3: { color: COLOR.green },
    };

    constructor() { this.reset(); }
    private reset() { this.promise = new Promise(resolve => this.resolve = resolve); }

    update() {
        // called on change
        this.resolve();
        this.reset();
    }

    changeColor(id: number, color: any) { // TODO: any => COLOR, so COLOR needs to be a type, not an object
        this._data[1].color = color;
        this.update();
    }

    get data() { return this._data; }
}

export default State;
