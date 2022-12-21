// Lightspeed/main/state.ts

// =====  Configuration  ===== \\
export const PAGES = 3; // number of different pages accessible via /$pageid

export enum COLOR {
    RED = "#A11",
    GREEN = "#1A1",
}

// =====  Classes & Types  ===== \\
export type UUID = string;

export class Page {
    readonly pageid: number;
    color: COLOR = COLOR.GREEN;

    constructor(pageid: number) {
        this.pageid = pageid;
    }
    get clients() {
        for (let c of State.clients) if (c.connected_to === this.pageid) return c;
    }
}

export class Client {
    readonly uuid: UUID;
    connected_to: number | null;
    last_event: Date;

    constructor(uuid: UUID) {
        this.uuid = uuid;
    }

    connected(pageid: number) {
        // called when a client connects
        this.connected_to = pageid;
        this.last_event = new Date();
    }
    disconnected() {
        // called when a client disconnects
        this.connected_to = null;
        this.last_event = new Date();
    }
}

class Clients extends Set<Client> {
    byUUID(uuid: UUID): Client | undefined {
        return [...this].find(c => c.uuid === uuid);
    }
}

// =====  State Object  ===== \\
const State = new (class {
    readonly pages: readonly Page[] = Array.from({ length: PAGES }, (_, i) => new Page(++i));
    readonly clients: Clients = new Clients();

    // internal promise
    #promise: Promise<void>;
    #resolve: () => void;

    constructor() {
        this.update(); // initially create the internal promise
    }

    changeColor(pageid: number, color: COLOR) {
        if (!isValidPageID(pageid)) throw new Error("Invalid ID");
        if (!color) throw new Error("Invalid color");
        this.pages[pageid].color = color;
        this.update();
    }

    update() {
        // called on change
        this.#resolve?.();
        this.#promise = new Promise(resolve => (this.#resolve = resolve));
    }

    get wait() {
        return this.#promise;
    }
})();

// =====  HELPERS  ===== \\
export function isValidPageID(id: number): Page | null {
    return (!isNaN(id) && State.pages[id]) || null;
}
export function colorFromString(color: string): COLOR | null {
    return Object(COLOR)[color.toUpperCase()] ?? null;
}

export default State;
