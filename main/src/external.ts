import State, { COLOR, PAGES } from "./state";

export function pollExternalAPI() {
    // Hier extern Farbe abfragen.
    // Beispiel (Farbe wird zufällig geändert):
    /*
        for (let i = 0; i < PAGES; i++) State.data[i].color = [COLOR.green, COLOR.red][Math.floor(Math.random() * 2)];
        State.update();
    */
}
