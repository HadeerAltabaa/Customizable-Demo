const apiURL = "http://localhost:3000/upload" // Used only locally change to an active api url

async function sendAPIRequest(file) {

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(apiURL, {
        method: "POST",
        body: formData,
    });


    const json = await res.json();

    document.querySelector("#previewID").innerHTML = JSON.stringify(json, null, 4)
}
