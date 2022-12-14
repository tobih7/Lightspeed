import express from "express";
import path from "path";

import apiRouter from "./api";

const streamURL = (process.env.WEB_HOST && process.env.WEB_PORT)
    ? `http://${process.env.WEB_HOST}:${process.env.WEB_PORT}`
    : "/";

const app = express();
app.set('view engine', 'pug')

// routes
app.use(apiRouter);

// default page: selection screen
app.get("/", (req, res) => {
    res.send("Lightspeed");
});

app.get("/:id", (req, res) => {
    // check if id is valid, if not redirect to /
    const id = parseInt(req.params.id);
    if (isNaN(id) || id < 1 || id > 3) {
        res.redirect("/");
        return;
    }

    res.render("stream", { streamURL });
});

app.listen(8080); // ?callback
