// Lightspeed/main/api.ts

import express from "express";
import State, { Client, colorFromString, isValidPageID, UUID as UUIDType } from "./state";
const router = express.Router();

router.use(express.json());

// inform the client about changes, as soon as they occur
router.post("/update", async (req, res) => {
    // /update waits for changes in the servers state, then sends them to the client
    // on initial connection the current state is always sent instantly

    const error = (code: number, msg: string) => res.status(code).json({ status: "error", error: msg });

    // parse and verify payload
    let PAGEID: number, UUID: UUIDType;
    if (!isValidPageID((PAGEID = parseInt(req.body.id)))) return error(400, "Invalid ID!");
    if (!(UUID = req.body.UUID as UUIDType)) return error(400, "Got no UUID!");

    let update = false;

    // update clients state
    let client = State.clients.byUUID(UUID);
    if (!client) {
        State.clients.add((client = new Client(UUID)));
        update = true;
    }
    client.connected(PAGEID);

    if (update) State.update(); // if neccessary, update all clients and instantly send new state
    else await State.wait; // else wait for changes

    // send updated state
    res.json({
        color: State.pages[PAGEID].color,
    });

    client.disconnected();
});

router.get("/set_color", (req, res) => {
    const pageid = parseInt(req.query.id?.toString());
    const color = colorFromString(req.query.color?.toString());
    if (!isValidPageID(pageid) || !color) return res.status(400).json({ error: "Invalid data!" });
    State.changeColor(pageid, color);
    res.send();
});

export default router;
