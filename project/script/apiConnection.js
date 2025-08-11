const apiURL = "http://localhost:8080/send"; // Used only locally, change to an active API URL

function sendRowData(id, rowId) {
    const rowCells = document.querySelectorAll(`.cell_${rowId}`);
    const rowData = {};

    rowCells.forEach(cell => {
        const key = cell.getAttribute('name');
        const value = cell.textContent || cell.innerText || '';
        rowData[key] = value;
    });

    sendAPIRequest(id, rowData)
}

function sendMockData(id) {
    const inputs = document.querySelectorAll(`.mockdata-${id}`)

    data = {}

    inputs.forEach(input => {
        data[input.getAttribute("name")] = input.value
    })

    sendAPIRequest(id, data)
}

async function sendAPIRequest(id, data) {
    let allFiles = JSON.parse(localStorage.getItem(`${projectID}-allFiles`)) || {};
    const fileData = allFiles[id];
    
    // if (!fileData) return;
    // if (area == 0) return alert("Please selecte an area before sending an API Request")


    if(!data) return
    
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
