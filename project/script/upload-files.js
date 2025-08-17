// Handle uploading files, preview, and delete
const preview = document.getElementById('preview');
const fileGrid = document.getElementById('fileGrid');
const fileInput = document.getElementById('fileInput');
const noFilesPanel = document.getElementById('noFilesPanel');
const filesPresentPanel = document.getElementById('filesPresentPanel');

//let uploadedFiles = [];
const uploadedFiles = {};

// Upload files
function handleFileUpload(input, sectionId) {
    const file = input.files[0];
    if (!file) return;

    // Retrieve previous files or initialize empty object
    let allFiles = JSON.parse(localStorage.getItem(`${projectID}-allFiles`) || "{}");

    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const fileExt = file.name.split('.').pop().toLowerCase();

    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            let workbook;

            if (fileExt === 'csv') {
                const csvText = e.target.result;
                workbook = XLSX.read(csvText, { type: 'string', raw: true });
            } else {
                const data = new Uint8Array(e.target.result);
                workbook = XLSX.read(data, { type: 'array' });
            }

            // Store the uploaded file in memory for immediate use
            uploadedFiles[sectionId] = { id: fileId, file, workbook };

            // Convert to serializable object for localStorage
            const storedFile = {
                id: fileId,
                name: file.name,
                type: fileExt,
                data: fileExt === 'csv'
                    ? e.target.result
                    : Array.from(new Uint8Array(e.target.result))
            };

            // Save per-section file
            localStorage.setItem(`uploadedFile-${sectionId}`, JSON.stringify(storedFile));

            // Save to "allFiles" list
            allFiles[sectionId] = storedFile;
            localStorage.setItem(`${projectID}-allFiles`, JSON.stringify(allFiles));

            // Update UI
            renderFileGrid(sectionId);
            document.getElementById(`noFilesPanel_${sectionId}`).style.display = 'none';
            document.getElementById(`filesPresentPanel_${sectionId}`).style.display = 'block';

        } catch (err) {
            alert("Error reading file. Please make sure the format is correct.");
            console.error(err);
        }
    };

    if (fileExt === 'csv') {
        reader.readAsText(file);
    } else {
        reader.readAsArrayBuffer(file);
    }
}

// Render individual file
function renderFileGrid(sectionId) {
    const fileGrid = document.getElementById(`fileGrid_${sectionId}`);

    fileGrid.innerHTML = '';
    for (let id in uploadedFiles) {
        if (sectionId != id) continue;
        let fileObj = uploadedFiles[id]
        const wrapper = document.createElement("div");
        wrapper.className = 'file-box';
        wrapper.innerHTML = `
            <div class='file-icon' onclick="previewExcelFile('${id}', '${sectionId}')">
                <button class='delete-btn' title="Delete" onclick="deleteFile('${id}', '${sectionId}')">&times;</button>
                <img src="https://img.icons8.com/color/48/000000/ms-excel.png" alt="Excel" />
                <p>${fileObj.file.name}</p>
            </div>
        `;
        fileGrid.appendChild(wrapper);
    };

    const noFilesPanel = document.getElementById(`noFilesPanel_${sectionId}`);
    const filesPresentPanel = document.getElementById(`filesPresentPanel_${sectionId}`);

    if (uploadedFiles.length === 0) {
        noFilesPanel.style.display = 'block';
        filesPresentPanel.style.display = 'none';
    }
}

const previewSettings = {};

function previewExcelFile(fileId, sectionId) {
    const fileObj = uploadedFiles[sectionId];
    if (!fileObj) return;

    // If first time, set default maxRows
    if (!previewSettings[sectionId]) {
        previewSettings[sectionId] = { maxRows: 11 };
    }

    const sheetName = fileObj.workbook.SheetNames[0];
    const worksheet = fileObj.workbook.Sheets[sheetName];

    let maxRows = previewSettings[sectionId].maxRows;

    const allRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const jsonData = allRows.slice(0, maxRows);
    const maxCols = Math.max(...jsonData.map(row => row.length));

    const normalizedData = jsonData.map(row => {
        const filled = [];
        for (let i = 0; i < maxCols; i++) {
            filled[i] = (row[i] !== undefined && row[i] !== null && row[i] !== '')
                ? row[i]
                : '&ZeroWidthSpace;';
        }
        return filled;
    });

    const dictData = allRows.slice(1).map(row => {
        const obj = {};
        normalizedData[0].forEach((header, i) => {
            obj[header] = row[i];
        });
        return obj;
    });

    const preview = document.getElementById(`preview_${sectionId}`);
    // const commentsTitle = document.getElementById(`commentsTitle_${sectionId}`);
    // const commentList = document.getElementById(`commentList_${sectionId}`);

    // === Slider UI in the header ===
    const sliderHTML = `
            <label>
                Rows to Show: 
                <span id="rowCount_${sectionId}">${maxRows - 1}</span>
            </label>
            <input type="range" 
                   min="1" 
                   max="${allRows.length < 100 ? allRows.length : 100}" 
                   value="${maxRows}" 
                   style="margin-left:10px;"
                   oninput="
                        document.getElementById('rowCount_${sectionId}').innerText = this.value - 1;
                        previewSettings['${sectionId}'].maxRows = parseInt(this.value, 10);
                   "
                   onchange="previewExcelFile(null, '${sectionId}')"
            >
    `;

    // === Table building ===
    let htmlTable = `<table class="excel-table" border="1" cellspacing="0" cellpadding="12">`;
    const headers = normalizedData[0] || [];

    const sendAllRows = () => {
        dictData.slice(0, 999).forEach(data => {
            sendAPIRequest(sectionId, data)
        })
    }

    normalizedData.forEach((row, rowIndex) => {
        htmlTable += `<tr style="background-color: ${rowIndex % 2 === 0 ? '#f0f0f0' : '#ffffff'};">`;

        if (rowIndex > 0) {
            htmlTable += `<td><button class="sendRowButton" onclick="sendRowData('${sectionId}', ${rowIndex})">Send Row</button></td>`;
        } else {
            htmlTable += `<th>Send Data</th>`;
        }

        (row || []).forEach((cell, colIndex) => {
            const cellTag = rowIndex === 0 ? 'th' : 'td';
            const content = (cell !== undefined && cell !== null && cell !== '') ? cell : '---';

            if (rowIndex > 0) {
                const colName = headers[colIndex] || `col${colIndex}`;
                htmlTable += `<${cellTag} contenteditable="false" class="cell_${rowIndex}" name="${colName}" style="padding: 2px 4px; font-size: 14px;">${content}</${cellTag}>`;
            } else {
                htmlTable += `<${cellTag} contenteditable="false" style="padding: 2px 4px; font-size: 14px;">${content}</${cellTag}>`;
            }
        });

        htmlTable += `</tr>`;
    });

    htmlTable += `</table>`;

    // === Final output ===
    preview.innerHTML = `
        <div class="doc-header">
            <div>
                <h3 style="padding-bottom: 10px">${fileObj.file.name.split(".")[0]}</h3>
                <button id="sendAllRows">Send all</button>
            </div>
            <div>
                ${sliderHTML}
            </div>
        </div>
        ${htmlTable}
    `;

    // Append comments
    // preview.appendChild(commentsTitle);
    // preview.appendChild(commentList);

    document.getElementById("sendAllRows").addEventListener("click", (e) => {
        sendAllRows()
    })


    mockBoxes[sectionId] = headers
    reloadMockBoxes()

    // commentsTitle.style.display = commentList.childElementCount > 0 ? 'block' : 'none';
    // updateCommentTitleVisibility(sectionId, commentList);
}


// Delete the file
function deleteFile(fileId, id) {
    delete uploadedFiles[id]
    renderFileGrid(id);
    document.getElementById(`preview_${id}`).innerHTML = '';
    localStorage.removeItem(`uploadedFile-${id}`);
    document.getElementById(`noFilesPanel_${id}`).style.display = 'block';
    document.getElementById(`filesPresentPanel_${id}`).style.display = 'none';
    //preview.innerHTML = '';
}

function loadFiles() {
    document.querySelectorAll(`.no-files-panel`).forEach(section => {
        const id = section.id.split('_')[1];
        const saved = localStorage.getItem(`uploadedFile-${id}`);
        if (!saved) return;


        try {
            const { id: fileId, name, type, data } = JSON.parse(saved);
            let workbook;

            if (type === 'csv') {
                workbook = XLSX.read(data, { type: 'string', raw: true });
            } else {
                const buffer = new Uint8Array(data);
                workbook = XLSX.read(buffer, { type: 'array' });
            }

            uploadedFiles[id] = { id: fileId, file: { name }, workbook };
            renderFileGrid(id);
            loadCommentsFromLocalStorage(section)
            document.getElementById(`noFilesPanel_${id}`).style.display = 'none';
            document.getElementById(`filesPresentPanel_${id}`).style.display = 'block';
        } catch (err) {
            console.error(`Failed to reload file ${id}: `, err);
            //localStorage.removeItem('uploadedFile');
        }
    })
}

document.addEventListener("DOMContentLoaded", loadFiles)