const apiURL = "http://localhost:8080/send"; // Used only locally, change to an active API URL

async function sendAPIRequest(id) {
    let allFiles = JSON.parse(localStorage.getItem("allFiles")) || {};
    const fileData = allFiles[id];

    
    // if (!fileData) return;
    // if (area == 0) return alert("Please selecte an area before sending an API Request")

    const data = {
        id: "",
        name: "",
        area: 0,
        action: "",
        actionData: {
            amount: ""
        },
        segment: ""
    }
        
    try {
        const res = await fetch(apiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json") && res.ok) {
            const json = await res.json();
            const content = json;
            const graphData = json.graphData;

            // Show content in the preview element
            console.log(content)
            document.querySelector(`#previewID-${id}`).innerHTML = content.message;

            addUserToWSWaitlist(id, data.id)

            // // Load existing graphs from localStorage or initialize empty object
            // let allGraphs = JSON.parse(localStorage.getItem("allGraphs")) || {};

            // console.log(json)

            // // Store graphData keyed by file name
            // allGraphs[fileData.name] = graphData;

            // // Save updated graphs object back to localStorage
            // localStorage.setItem("allGraphs", JSON.stringify(allGraphs));

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
