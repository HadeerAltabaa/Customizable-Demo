const apiURL = "http://localhost:3000/upload" // Used only locally change to an active api url

async function sendAPIRequest(area) {

    let file = selectedFile;

    if (!file)
        return alert("NO FILE")

    console.log({
        file,
        area,
        time: new Date().toTimeString()
    })

    return // Stops the code here for now

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(apiURL, {
        method: "POST",
        body: formData,
    });


    const json = await res.json();

    const content = json.content

    document.querySelector("#previewID").innerHTML = content
}
