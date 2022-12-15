import express from 'express';
import State, { colorFromString, isIDValid } from './state';
const router = express.Router();

router.use(express.json());

// inform the client about changes, as soon as they occur
router.post("/update", async (req, res) => {
    // /update waits for changes in the servers state, then sends them to the client
    // on initial connection the current state is always sent instantly

    const error = (code: number, msg: string) => res.status(code).json({ status: "error", error: msg })

    // parse and verify payload validity
    let id: number, UUID: string;
    if (!isIDValid(id = parseInt(req.body.id))) return error(400, "Invalid ID!");
    if (!(UUID = req.body.UUID)) return error(400, "Got no UUID!")

    let update = false;

    // update state
    // ...

    if (!State.data[id].connected.has(UUID)) {
        console.log(`Client for ID ${id} connected.`)
        State.data[id].connected.add(UUID);
        update = true;
    }

    if (update) State.update() // if neccessary, update all clients and instantly sent new state
    else await State.wait; // else wait for changes

    // send updated state
    res.json({
        status: "ok",
        color: State.data[id].color
    });
});

router.get("/set_color", (req, res) => {
    let id, color;
    if (!isIDValid(id = parseInt(req.query.id?.toString())) || !(color = colorFromString(req.query.color?.toString())))
        return res.status(400).json({ status: "error", error: "Invalid data!" });
    State.changeColor(id, color);
    res.send();
});

export default router;
