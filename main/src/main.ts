import express from "express";
import path from "path";

import apiRouter from "./api";
import { isIDValid } from "./state";

const streamURL = (process.env.WEB_HOST && process.env.WEB_PORT)
    ? `http://${process.env.WEB_HOST}:${process.env.WEB_PORT}` : "/";

const app = express();
app.set('view engine', 'pug')

// routes
app.use(apiRouter);

// default page: selection screen
app.get("/", (req, res) => {
    res.send("Lightspeed");
});

app.get("/:id", (req, res) => {
    // if id is invalid redirect to /
    if (!isIDValid(parseInt(req.params.id))) return res.redirect("/");

    res.render("stream", { streamURL });
});

app.listen(8090); // ?callback
