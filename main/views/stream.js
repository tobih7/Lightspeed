const iframe = document.querySelector("body iframe");
const id = document.location.pathname.slice(1);

// UUID to identify this session
UUID = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));

async function startUpdate() {
    // initially get the servers state and then watch for changes
    // called on load of stream iframe
    await updateState(false);
    iframe.style.display = 'inline'; // unhide the stream
    updateLoop();
}

async function updateLoop() {
    try { await updateState(); }
    catch { await new Promise(r => setTimeout(r, 1000)); } // wait before retrying
    updateLoop();
}

async function updateState() {
    const res = await fetch("/update", {
        method: "POST",
        cache: "no-cache",
        keepalive: true,
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ UUID, id })
    });
    const data = await res.json();

    console.log(data);

    // parse data
    iframe.style.borderColor = data.color;
}

