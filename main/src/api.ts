import express from 'express';
import State, { COLOR } from './api_meta';
const router = express.Router();

router.post("/update", async (req, res) => {

    // check for required params
    // if (!req.query.id) {
    //     res.status(400);
    //     res.send({
    //         "status": "error",
    //         "error": "Missing ID"
    //     });
    //     return;
    // }

    await State.promise;

    res.send(State.data);

});

router.get("/simulate_change", (req, res) => {
    State.changeColor(1, COLOR.red);
    res.send();
});

export default router;
