// Lightspeed/main/api.ts

import express from "express";
import { v4 as generateUUID, validate as validateUUID } from "uuid";

import State, { Client, colorFromString, isValidPageID, UUID as UUIDType } from "./state";

type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
type JSONArray = Array<JSONValue>;
type JSONObject = { [key: string]: JSONValue; };

const router = express.Router();

router.use(express.json());

// inform the client about changes, as soon as they occur
router.post("/update", async (req, res, next) => {
    // /update waits for changes in the servers state, then sends them to the client
    // on initial connection the current state is always sent instantly

    let data: JSONObject = {}; // the data that will be sent to the client
    let update = false; // whether the state was mutated
    let skip_wait = false; // whether to skip waiting for changes

    const error = (code: number, error: string, obj?: JSONObject) => res.status(code).json({ ...obj, error });

    // Page ID
    const PAGEID = parseInt(req.body.pageid);
    if (!isValidPageID(PAGEID)) return error(400, "Invalid ID!");

    // UUID
    const UUID: string = req.body.UUID ?? generateUUID();
    if (req.body.UUID == null) data.UUID = UUID;
    if (!validateUUID(UUID)) return error(400, "Invalid UUID!"); // new client, create new UUID and send to client

    // Client
    const client = State.clients.byUUID(UUID) || new Client(UUID);
    if (!State.clients.has(client)) State.clients.add(client);
    if (!client.sockets.has(res.socket)) skip_wait = true;
    client.connected(PAGEID, res.socket);

    // parse payload
    // ...
    // (client could send data, that changes the server state; if so set 'update' to true)

    // if neccessary, immediately update all clients, else wait for changes
    if (Object.keys(data).length !== 0 || update) State.update();
    else if (!skip_wait) await State.wait;

    // send updated state
    res.json({
        ...data,
        color: State.pages[PAGEID].color
    });
    // TODO: store last data in client, compare and only send if data changed
});

router.get("/state", (req, res) => {
    res.json(State);
});

router.get("/set_color", (req, res) => {
    const pageid = parseInt(req.query.id?.toString());
    const color = colorFromString(req.query.color?.toString());
    if (!isValidPageID(pageid) || !color) return res.status(400).json({ error: "Invalid data!" });
    State.changeColor(pageid, color);
    res.send();
});

export default router;
