// Lightspeed/main/state.ts

import { Socket } from "net";

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
        return Array.from(State.clients).filter(c => c.connected_to === this.pageid);
    }
    toJSON() {
        return {
            pageid: this.pageid,
            color: this.color,
            clients: this.clients.map(c => c.uuid)
        };
    }
}

export class Client {
    readonly uuid: UUID;
    #sockets: Set<Socket> = new Set();
    #connected_to: number | null;
    #last_event: Date;

    constructor(uuid: UUID) {
        this.uuid = uuid;
    }

    connected(pageid: number, socket: Socket) {
        // called when a client connects
        if (!this.#sockets.has(socket)) {
            // client connected from new socket
            socket.addListener("close", () => {
                this.#sockets.delete(socket);
                if (this.#sockets.size === 0) this.disconnected();
            });
            this.#sockets.add(socket);
        }
        this.#connected_to = pageid;
        this.#last_event = new Date();
    }
    disconnected() {
        // called when a client disconnects
        this.#connected_to = null;
        this.#last_event = new Date();
    }

    get sockets() {
        return this.#sockets;
    }
    get address() {
        // let adr = this.#sockets..remoteAddress; // TODO
        // return adr.includes(":") ? `[${adr}]` : adr;
        return Array.from(new Set(Array.from(this.#sockets).map(s => s.remoteAddress))).join(", ");;
    }
    get connected_to() {
        return this.#connected_to;
    }
    get last_event() {
        return this.#last_event;
    }

    toJSON() {
        return {
            sockets: this.sockets.size,
            ...Object.fromEntries(["uuid", "address", "connected_to", "last_event"].map(x => [x, this[x as keyof Client]])),
        };
    }
}

class Clients extends Set<Client> {
    override add(c: Client): this {
        if (this.byUUID(c.uuid)) throw new Error("Attempted to add Client with UUID of existing Client!");
        super.add(c);
        return this;
    }
    byUUID(uuid: UUID): Client | null {
        return [...this].find(c => c.uuid === uuid) ?? null;
    }
    toJSON() { return [...this]; }
}

// =====  State Object  ===== \\
const State = new class {
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
};

// =====  HELPERS  ===== \\
export function isValidPageID(id: number): Page | null {
    return (!isNaN(id) && State.pages[id]) || null;
}
export function colorFromString(color: string): COLOR | null {
    return Object(COLOR)[color.toUpperCase()] ?? null;
}

export default State;
