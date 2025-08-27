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

    let actionInputs = document.querySelectorAll(".action-input")
    let actions = {}

    let actionType = document.querySelector("#customer-actions-choices")

    actionInputs.forEach(input => {
        if(!data[input.getAttribute("name")]) {
            actions[input.getAttribute("name")] = input.value
        }
    })

    if(!data?.id) data.id = crypto.randomUUID().replace(/-/g, '');
    if(!data?.area) data.area = area || "none"
    if(!data?.actionType) data.actionType = actionType?.value || "None"

    data = { ...data, ...actions }

    // createAnOffer(id, data.id, "TEST MESSAGE")

    
    // Change this to the values that will show in the timeline
    // NOTE: Delete this block of code to remove the timeline
    if(data["transaction datetime"]) {
        if(data.status == 0) {
            addItemToTimeLine("Failure", data["transaction datetime"], data.customerid, id)
        } else if(data.status == 1) {
            addItemToTimeLine("Success", data["transaction datetime"], data.customerid, id)
        }
    }
    // END
    
    
    for(let i in data) {
        if(i.includes(" ")) {
            data[i.replaceAll(" ", "_")] = data[i]
            delete data[i]
        }
    }

    console.log("THE FRONTEND IS SENDING THIS DATA ( MAKE SURE IT MATCHES THE SOURCE WINDOW )")
    console.log(data)

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

            addUserToWSWaitlist(id, data.id);

            // --- optional graph storage code (commented) ---
            // let allGraphs = JSON.parse(localStorage.getItem("allGraphs")) || {};
            // allGraphs[fileData.name] = graphData;
            // localStorage.setItem("allGraphs", JSON.stringify(allGraphs));
        } else {
            const text = await res.text();
            // console.error("Invalid response:", text);
            // alert("Upload failed: " + text);
        }
    } catch (error) {
        // console.error("Error uploading file:", error);
        // alert("Failed to reach API server.");
    }
}
