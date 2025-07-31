const apiURL = "http://localhost:3000/upload"; // Used only locally, change to an active API URL

async function sendAPIRequest(id) {
    let allFiles = JSON.parse(localStorage.getItem("allFiles")) || {};
    const fileData = allFiles[id];

    if (!fileData) return;
    if (area == 0) return alert("Please selecte an area before sending an API Request")

    // ✅ Convert to a JSON payload
    const payload = {
        id: fileData.id,
        name: fileData.name,
        type: fileData.type,
        data: fileData.data, // Already an Array<number> or string,
        area
    };

    try {
        const res = await fetch(apiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const json = await res.json();
            const content = json.content;
            const graphData = json.graphData;

            // Show content in the preview element
            document.querySelector(`#previewID-${id}`).innerHTML = content;

            // Load existing graphs from localStorage or initialize empty object
            let allGraphs = JSON.parse(localStorage.getItem("allGraphs")) || {};

            console.log(json)

            // Store graphData keyed by file name
            allGraphs[fileData.name] = graphData;

            // Save updated graphs object back to localStorage
            localStorage.setItem("allGraphs", JSON.stringify(allGraphs));

        } else {
            const text = await res.text();
            console.error("Invalid response:", text);
            alert("Upload failed: " + text);
        }
    } catch (error) {
        console.error("Error uploading file:", error);
        alert("Failed to reach API server.");
    }
}
