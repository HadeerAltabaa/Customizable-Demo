const logoInput = document.getElementById('logoInput');
const previewLogo = document.getElementById('previewLogo');

const fileInput = document.getElementById('fileInput');
const fileGrid = document.getElementById('fileGrid');
const preview = document.getElementById('preview');
const fileLimitInput = document.getElementById('fileLimit');
const noFilesPanel = document.getElementById('noFilesPanel');

const filesPresentPanel = document.getElementById('filesPresentPanel');
const commentInput = document.getElementById("commentInput");
const addCommentBtn = document.getElementById("addCommentBtn");
const commentList = document.getElementById("commentList");

// Handle logo upload
logoInput.addEventListener('change', () => {
    const file = logoInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Image = e.target.result;
        previewLogo.src = base64Image;
        localStorage.setItem('logoImage', base64Image);
    };
    reader.readAsDataURL(file);
});

const storageKey = 'uploadedExcelFiles';
let fileLimit = parseInt(fileLimitInput.value, 20) || 1;

// Load stored files on page load
window.addEventListener('load', () => {
    const storedFiles = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (storedFiles.length > 0) {
        switchToFilesPanel();
        storedFiles.forEach(renderFileButton);
    } else {
        switchToEmptyPanel();
    }

    const storedImage = localStorage.getItem('previewImage');
    if (storedImage) {
        previewImage.src = storedImage;
    }
});

// Update file limit
fileLimitInput.addEventListener('input', () => {
    fileLimit = parseInt(fileLimitInput.value, 10) || 1;
    clearAllFiles();
});

// File upload handler
fileInput.addEventListener('change', () => {
    const selectedFiles = Array.from(fileInput.files);

    if (fileLimit && selectedFiles.length > fileLimit) {
        alert(`You can only upload up to ${fileLimit} file(s).`);
        fileInput.value = '';
        return;
    }

    // Clear stored files and UI before adding new ones
    localStorage.setItem(storageKey, JSON.stringify([]));
    fileGrid.innerHTML = "";
    clearPreview();
    switchToEmptyPanel();

    let storedFiles = [];

    let filesProcessed = 0;
    selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
            const fileObj = {
                name: file.name,
                type: file.type,
                content: Array.from(new Uint8Array(reader.result))
            };
            storedFiles.push(fileObj);
            renderFileButton(fileObj);

            filesProcessed++;
            if (filesProcessed === selectedFiles.length) {
                localStorage.setItem(storageKey, JSON.stringify(storedFiles));
            }
        };
        reader.readAsArrayBuffer(file);
    });

    fileInput.value = '';
});

function clearPreview() {
    preview.innerHTML = '';
}
/*fileInput.addEventListener('change', () => {
    const selectedFiles = Array.from(fileInput.files);
    let storedFiles = JSON.parse(localStorage.getItem(storageKey) || '[]');

    if (fileLimit && storedFiles.length + selectedFiles.length > fileLimit) {
        alert(`You can only upload up to ${fileLimit} file(s).`);
        fileInput.value = '';
        return;
    }

    selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
            const fileObj = {
                name: file.name,
                type: file.type,
                content: Array.from(new Uint8Array(reader.result)) // Store as array of numbers
            };
            storedFiles.push(fileObj);
            localStorage.setItem(storageKey, JSON.stringify(storedFiles));
            renderFileButton(fileObj);
            switchToFilesPanel();
        };
        reader.readAsArrayBuffer(file);
    });

    fileInput.value = '';
});*/

addCommentBtn.addEventListener("click", () => {
    const commentText = commentInput.value.trim();

    if (commentText !== "") {
        const comment = document.createElement("div");
        comment.className = "comment";

        const textSpan = document.createElement("span");
        textSpan.textContent = commentText;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "x";
        deleteBtn.className = "delete-comment-btn";
        deleteBtn.title = "Delete this Comment";
        deleteBtn.onclick = () => {
            comment.remove();
            updateCommentTitleVisibility();
        };

        comment.appendChild(textSpan);
        comment.appendChild(deleteBtn);

        commentList.appendChild(comment);
        commentInput.value = "";

        updateCommentTitleVisibility();
    }
});

// Render individual file icon + preview + delete button
function renderFileButton(file) {
    const wrapper = document.createElement('div');
    wrapper.className = 'file-icon';

    wrapper.innerHTML = `
    <button class="delete-btn" title="Delete">&times;</button>
    <img src="images/excel-icon.png" alt="Excel Icon">
    <p>${file.name}</p>
  `;

    wrapper.addEventListener('click', () => {
        previewExcelFile(file);
        generateChartFromExcel(file);

        // Deselect all other file icons
        document.querySelectorAll('.file-icon').forEach(icon => {
            icon.classList.remove('selected');
        });

        // Select this one
        wrapper.classList.add('selected');
    });

    wrapper.querySelector('.delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteFile(file.name);
    });

    fileGrid.appendChild(wrapper);
}

function updateCommentTitleVisibility() {
    const title = document.getElementById("commentsTitle");
    const hasComments = commentList.querySelectorAll(".comment").length > 0;
    title.style.display = hasComments ? "block" : "none";
}

// Preview first 6 rows of Excel sheet
function previewExcelFile(file) {
    const commentsTitle = document.getElementById("commentsTitle");
    const currentComments = commentList;

    preview.innerHTML = 'Loading preview...';

    const data = new Uint8Array(file.content);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }).slice(0, 6);

    let html = '<table border="1" cellspacing="0" cellpadding="4">';
    rows.forEach(row => {
        html += '<tr>' + row.map(cell => `<td>${cell ?? ''}</td>`).join('') + '</tr>';
    });
    html += '</table>';

    preview.innerHTML = html;

    preview.appendChild(commentsTitle);
    preview.appendChild(currentComments);

    //preview.appendChild(commentList);

    updateCommentTitleVisibility();
}

async function generateChartFromExcel(file) {
    const graphCanvas = document.getElementById("generatedChart");
    const context = graphCanvas.getContext("2d");
    const chartKey = `chart_${file.name}`;
    const storedChart = localStorage.getItem(chartKey);

    if (storedChart) {
        const config = JSON.parse(storedChart);
        renderChart(context, config);
        return;
    }

    const data = new Uint8Array(file.content);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }).slice(0, 6);
    const plainText = rows.map(r => r.join(", ")).join("\n");

    const chartConfig = await getChartInstructionFromOpenAI(plainText);

    if (chartConfig) {
        localStorage.setItem(chartKey, JSON.stringify(chartConfig));
        renderChart(context, chartConfig);
    } else {
        context.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
        context.font = "16px Arial";
        context.fillText("Failed to generate chart", 10, 50);
    }
}

function renderChart(ctx, config) {
    if (window.currentChart) {
        window.currentChart.destroy();
    }

    window.currentChart = new Chart(ctx, {
        type: config.type || 'bar',
        data: {
            labels: config.labels,
            datasets: config.datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}


// Delete file from localStorage and UI
function deleteFile(fileName) {
    let stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
    stored = stored.filter(f => f.name !== fileName);
    localStorage.setItem(storageKey, JSON.stringify(stored));

    fileGrid.innerHTML = '';
    preview.innerHTML = '';

    if (stored.length === 0) {
        switchToEmptyPanel();
    } else {
        stored.forEach(renderFileButton);
    }
}

// Clear everything on file limit change
function clearAllFiles() {
    localStorage.removeItem(storageKey);
    fileGrid.innerHTML = '';
    preview.innerHTML = '';
    switchToEmptyPanel();
}

// UI Toggle Functions
function switchToFilesPanel() {
    noFilesPanel.style.display = 'none';
    filesPresentPanel.style.display = 'block';
}

function switchToEmptyPanel() {
    noFilesPanel.style.display = 'block';
    filesPresentPanel.style.display = 'none';
}


// add the notes functionality
const notesContainer = document.getElementById("notesContainer");
const notesInput = document.getElementById("notesInput");
const addBtn = document.getElementById("addNotesBtn");

let notes = JSON.parse(localStorage.getItem('notes')) || [];

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
}

function renderNotes() {
    notesContainer.innerHTML = '';
    notes.forEach((note, index) => {
        const noteDiv = document.createElement("div");
        noteDiv.className = "note-item";

        const editBtn = document.createElement("button");
        editBtn.innerHTML = '✏️';
        editBtn.onclick = () => {
            const newText = prompt("Edit your note:", note);
            if (newText !== null) {
                notes[index] = newText;
                saveNotes();
            }
        };

        const textSpan = document.createElement('div');
        textSpan.className = 'note-text';
        textSpan.innerText = note;

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.onclick = () => {
            if (confirm('Delete this note?')) {
                notes.splice(index, 1);
                saveNotes();
            }
        };

        noteDiv.appendChild(editBtn);
        noteDiv.appendChild(textSpan);
        noteDiv.appendChild(deleteBtn);

        notesContainer.appendChild(noteDiv);
    });
}

addBtn.onclick = () => {
    const note = notesInput.value.trim();
    if (note) {
        notes.unshift(note);
        notesInput.value = '';
        saveNotes();
    }
};

renderNotes();

let previewImage = document.getElementById("previewImage");
let imageInput = document.getElementById("imageInput");

imageInput.onchange = function() {
    const file = imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Image = e.target.result;
        previewImage.src = base64Image;
        localStorage.setItem('previewImage', base64Image);
    };
    reader.readAsDataURL(file);
}

const downloadImageBtn = document.getElementById("downloadImageBtn");

downloadImageBtn.addEventListener("click", () => {
    const imageURL = previewImage.src;
    const link = document.createElement('a');
    link.href = imageURL;
    link.download = 'image.png'; // default name for download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Download graph button functionality
const downloadGraphBtn = document.getElementById("downloadGraphBtn");
const graphCanvas = document.getElementById("generatedChart");

downloadGraphBtn.addEventListener("click", () => {
    const imageURL = graphCanvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = imageURL;
    link.download = 'graph.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Update map preview and Persist the map URL
const previewMap = document.getElementById("previewMap");
const mapInput = document.getElementById("mapInput");
const downloadMapBtn = document.getElementById("downloadMapBtn");

// Load saved map URL on page load
const savedMapURL = localStorage.getItem('mapURL');
if (savedMapURL) {
    previewMap.src = savedMapURL;
    mapInput.value = savedMapURL;
}

// Update map preview when user enters a new URL
mapInput.addEventListener("input", () => {
    const url = mapInput.value.trim();
    if (url) {
        previewMap.src = url;
        localStorage.setItem('mapURL', url);
    } else {
        alert("Please enter a valid Google Maps embed URL.");
    }
});

// Download map preview as an image
downloadMapBtn.addEventListener("click", () => {
    alert("Due to browser limitations, downloading maps directly as images is not supported. Please use the Google Maps interface to save the map image.");
})