const apiURL = "http://localhost:3000/upload" // Used only locally change to an active api url

async function sendAPIRequest(id) {
    const file = allFiles[id]

    const formData = new FormData();
    formData.append("file", file); // ✅ raw File object

    const res = await fetch(apiURL, {
        method: "POST",
        body: formData,
    });

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        const json = await res.json();
        const content = json.content;
        document.querySelector("#previewID").innerHTML = content;
    } else {
        const text = await res.text();
        console.error("Invalid response:", text);
        alert("Upload failed: " + text);
    }
}