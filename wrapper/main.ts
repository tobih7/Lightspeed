
const PAGE = document.location.pathname.slice(1);
const COLORS = {
    red: '#A11',
    green: '#1A1'
}
let IFRAME: HTMLIFrameElement;

function main() {

    // check if valid page (/1, /2, etc.)
    if (!["1", "2", "3"].includes(PAGE)) {
        alert("no page");
        return;
    }

    showStream();
    updateColor();

}

function updateColor() {
    //req API w keep alive, resp on change
    //on drop resend req -> loop
    IFRAME.style.borderColor = COLORS.red;
}

function setColor() {}

function showStream() {
    IFRAME = document.createElement("iframe");
    IFRAME.src = getStreamURL();
    document.body.appendChild(IFRAME);
    IFRAME.onload = () => { IFRAME.style.display = "inline"; };
}

function getStreamURL() {
    // TODO: cache URL
    const req = new XMLHttpRequest();
    req.open('GET', '/stream_url', false);
    req.send()
    return req.responseText;
}

main();