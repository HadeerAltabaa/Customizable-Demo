// Handle uploading files, preview, and delete
const preview = document.getElementById('preview');
const fileGrid = document.getElementById('fileGrid');
const fileInput = document.getElementById('fileInput');
const noFilesPanel = document.getElementById('noFilesPanel');
const filesPresentPanel = document.getElementById('filesPresentPanel');

let uploadedFiles = [];

// Upload files
function handleFileUpload(input) {
    const file = input.files[0];
    if (!file) return;


    // Handles the logic of sending the api request to the backend
    sendAPIRequest(file);

    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const fileExt = file.name.split('.').pop().toLowerCase();

    const reader = new FileReader();

    reader.onload = function (e) {
        let workbook;
        try {
            if (fileExt === 'csv') {
                const csvText = e.target.result;
                workbook = XLSX.read(csvText, { type: 'string', raw: true });
            } else {
                const data = new Uint8Array(e.target.result);
                workbook = XLSX.read(data, { type: 'array' });
            }

            // Clear previous uploads
            uploadedFiles = [{ id: fileId, file, workbook }];
            renderFileGrid();
            noFilesPanel.style.display = 'none';
            filesPresentPanel.style.display = 'block';

            localStorage.setItem("uploadedFile", JSON.stringify({
                id:fileId,
                name: file.name,
                type: fileExt,
                data: fileExt === 'csv' ? e.target.result : Array.from(new Uint8Array(e.target.result))
            }));
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

    input.value = '';
}

// Render individual file 
function renderFileGrid() {
    fileGrid.innerHTML = '';
    uploadedFiles.forEach(({ id, file }) => {
        const wrapper = document.createElement("div");
        wrapper.className = 'file-box';
        wrapper.innerHTML = `
            <div class='file-icon' onclick="previewExcelFile('${id}')">
                <button class='delete-btn' title="Delete" onclick="deleteFile('${id}')">&times;</button>
                <img src="https://img.icons8.com/color/48/000000/ms-excel.png" alt="Excel" />
                <p>${file.name}</p>
            </div>
        `;
        fileGrid.appendChild(wrapper);
    });

    if (uploadedFiles.length === 0) {
        noFilesPanel.style.display = 'block';
        filesPresentPanel.style.display = 'none';
    }
}

// Preview the file content
const commentsTitle = document.getElementById("commentsTitle");
const currentComments = commentList;

function previewExcelFile(fileId) {
    const fileObj = uploadedFiles.find(f => f.id === fileId);
    if (!fileObj) return;

    const sheetName = fileObj.workbook.SheetNames[0];
    const worksheet = fileObj.workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    let htmlTable = `<table class="excel-table" border="1" cellspacing="0" cellpadding="5">`;
    jsonData.forEach((row, rowIndex) => {
        htmlTable += `<tr>`;
        (row || []).forEach(cell => {
            const cellTag = rowIndex === 0 ? 'th' : 'td';
            htmlTable += `<${cellTag} contenteditable="false">${cell !== undefined ? cell : ''}</${cellTag}>`;
        });
        htmlTable += `</tr>`;
    });
    htmlTable += `</table>`;

    preview.innerHTML = `<h3 style="padding-bottom: 10px">${fileObj.file.name}</h3>` + htmlTable;


    preview.appendChild(commentsTitle);
    preview.appendChild(currentComments);

    //preview.appendChild(commentList);

    updateCommentTitleVisibility();
}

// Delete the file
function deleteFile(fileId) {
    uploadedFiles = uploadedFiles.filter(f => f.id !== fileId);
    renderFileGrid();
    preview.innerHTML = '';
}

window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem("uploadedFile");
    if (!saved) return;

    try {
        const {id, name, type, data} = JSON.parse(saved);
        let workbook;

        if (type === 'csv') {
            workbook = XLSX.read(data, {type: 'string', raw: true});
        } else {
            const buffer = new Uint8Array(data);
            workbook = XLSX.read(buffer, {type: 'array'});
        }

        uploadedFiles = [{id, file:{name}, workbook}];
        renderFileGrid();
        noFilesPanel.style.display = 'none';
        filesPresentPanel.style.display = 'block';
    } catch (err) {
        console.error("Failed to reload file: ", err);
        localStorage.removeItem('uploadedFile');
    }
})
