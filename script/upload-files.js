const fileGrid = document.getElementById("fileGrid");
const previewPanel = document.getElementById("preview");
const noFilesPanel = document.getElementById("noFilesPanel");
const filesPresentPanel = document.getElementById("filesPresentPanel");

let uploadedFiles = [];

function handleFileUpload(input) {
    const files = Array.from(input.files);

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

            uploadedFiles.push({ id: fileId, file, workbook });
            renderFileGrid();
            noFilesPanel.style.display = "none";
            filesPresentPanel.style.display = "block";
        };
        reader.readAsArrayBuffer(file);
    });

    input.value = "";
}

function renderFileGrid() {
    fileGrid.innerHTML = '';
    uploadedFiles.forEach(({ id, file }) => {
        const fileBox = document.createElement("div");
        fileBox.className = "file-box";
        fileBox.innerHTML = `
                <div class="file-icon" onclick="previewFile('${id}')">
                    <img src="https://img.icons8.com/color/48/000000/ms-excel.png" alt="Excel" />
                    <p>${file.name}</p>
                </div>
                <span class="delete-btn" onclick="deleteFile('${id}')">x</span>
            `;
        fileGrid.appendChild(fileBox);
    });

    if (uploadedFiles.length === 0) {
        noFilesPanel.style.display = "block";
        filesPresentPanel.style.display = "none";
    }
}

function previewFile(fileId) {
    const fileObj = uploadedFiles.find(f => f.id === fileId);
    if (!fileObj) return;

    const sheetName = fileObj.workbook.SheetNames[0];
    const worksheet = fileObj.workbook.Sheets[sheetName];
    const htmlTable = XLSX.utils.sheet_to_html(worksheet, { editable: true });

    previewPanel.innerHTML = `<h3>${fileObj.file.name}</h3>` + htmlTable;
}

function deleteFile(fileId) {
    uploadedFiles = uploadedFiles.filter(f => f.id !== fileId);
    renderFileGrid();
    previewPanel.innerHTML = '';
}