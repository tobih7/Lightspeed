// =====  Lightspeed  ===== \\

const iframe = document.querySelector("body iframe");
const pageid = document.location.pathname.slice(1);

let UUID = localStorage.getItem("UUID");

const abortcontroller = new AbortController();

async function updateState() {
    const res = await fetch("/update", {
        method: "POST",
        cache: "no-cache",
        keepalive: true,
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ UUID, pageid }),
        signal: abortcontroller.signal
    });
    const data = await res.json();

    // error handling
    if (res.status !== 200) {
        if (UUID && data.invalid_uuid === true) {
            // if the server responds with invalid_uuid, but an UUID is already set, the server
            // probably was restarted or crashed, therefore reload the page to reset the local state
            location.reload();
        }
        if (data.error) console.log(data.error);
        throw new Error; // error instead of simple return to trigger timeout
    }

    // UUID (sent on first ever request)
    if (data.UUID) {
        UUID = data.UUID;
        localStorage.setItem("UUID", UUID);
    }

    // apply updated state
    iframe.style.borderColor = data.color;
    iframe.style.display = "inline"; // unhide the stream (only required once aber egal)
}

async function updateLoop() {
    // called on load of stream iframe
    try { await updateState(); }
    catch { await new Promise(r => setTimeout(r, 1000)); } // wait before retrying
    updateLoop();
}

onbeforeunload = abortcontroller.abort;

