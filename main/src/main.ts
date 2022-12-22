// Lightspeed/main/main.ts

const POLLING_INTERVAL = 500; // how often to check the externel API for changes in state (in ms)

import express from "express";

import apiRouter from "./api";
import { pollExternalAPI } from "./external";
import { isValidPageID } from "./state";

const streamURL = process.env.WEB_HOST && process.env.WEB_PORT ? `http://${process.env.WEB_HOST}:${process.env.WEB_PORT}` : "/stream";

const app = express();
app.set("view engine", "pug");

// routes
app.use(apiRouter);

// default page: selection screen
app.get("/", (req, res) => {
    res.send("Lightspeed");
});

app.get("/stream", (req, res) => {
    res.status(404).send("No stream available!");
});

app.get("/:id", (req, res) => {
    // if id is invalid redirect to /
    if (!isValidPageID(parseInt(req.params.id))) return res.redirect("/");
    res.render("stream", { streamURL });
});

setInterval(pollExternalAPI, POLLING_INTERVAL);

app.listen(8090);
