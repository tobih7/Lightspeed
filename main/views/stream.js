const iframe = document.querySelector("body iframe");
const id = document.location.pathname.slice(1);

async function update() {
    try {
        await requestUpdate();
    } catch (error) {
        console.log(error);
        await new Promise(r => setTimeout(r, 1000)); // wait before retrying
    }
    update();
}

async function requestUpdate() {
    const res = await fetch("/update", {
        method: "POST",
        cache: "no-cache",
        keepalive: true,
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ id })
    });
    const data = await res.json();

    console.log(data);

    // parse data
    iframe.style.borderColor = data.color;
}

