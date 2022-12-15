
export enum COLOR {
    red = '#A11',
    green = '#1A1'
}

type DataType = {
    [key: number]: {
        color: COLOR,
        connected: Set<string>
    },
}

// TODO maybe make this class itself awaitable
const State = new class {
    private promise: Promise<void>;
    private resolve: (value?: unknown) => void;
    public data: DataType; // this object stores the servers state

    constructor() {
        // construct initial data
        this.data = {
            1: { color: COLOR.green, connected: new Set() },
            2: { color: COLOR.green, connected: new Set() },
            3: { color: COLOR.green, connected: new Set() },
        };
        // initially create the internal promise
        this.reset();
    }

    update() {
        // called on change
        this.resolve();
        this.reset();
    }

    changeColor(id: number, color: COLOR) {
        if (!(id in this.data) || !color) return;
        this.data[id].color = color;
        this.update();
    }

    get wait() { return this.promise; }
    private reset() { this.promise = new Promise(resolve => this.resolve = resolve); }
}

export const isIDValid = (id: number) => (!isNaN(id) && (id in State.data));
export const colorFromString = (color: string): COLOR => Object(COLOR)[color] ?? null;

export default State;
