// Load stored files on page load
window.addEventListener('DOMContentLoaded', () => {
    const storedImage = localStorage.getItem('previewImage');
    if (storedImage) {
        previewImage.src = storedImage;
    }
});

// Editing Mode
const editBtn = document.getElementById('editButton');
const addSectionBtn = document.getElementById('addSectionBtn');
const saveBtn = document.getElementById('saveBtn');
const editControls = document.getElementById('editControls');
const addSectionContainer = document.getElementById('addSectionContainer');

let editMode = false;

const sectionTemplates = {
    "doc-section": `
    <div class="doc-section custom-section" id="doc_${Date.now()}">
      <button class="deleteBtn" style="float:right;">🗑️</button>
      <h2 contenteditable="true">Documents</h2>
                  <!-- when no files are uploaded -->
            <div class="no-files-panel" id="noFilesPanel">
                <p>Please add your excel sheets from here...</p>
                <div class="upload-box">
                    <input type="number" min="1" id="fileLimit" value="1">
                    <label for="fileInput">Select</label>
                    <input type="file" id="fileInput" multiple accept=".xlsx,.xls,.csv">
                </div>
            </div>

            <!-- when files are uploaded -->
            <div class="files-present-panel" id="filesPresentPanel" style="display: none;">
                <p class="info-text">These are your documents</p>

                <div class="file-preview-layout">
                    <div class="file-grid" id="fileGrid"></div>

                    <div class="preview-panel" id="preview">
                        <!-- Preview content injected via JS -->
                        <h2 id="commentsTitle" style="display: none;">Comments</h2>
                        <div id="commentList" class="comment-list"></div>
                    </div>
                </div>

                <div class="comment-box">
                    <input type="text" id="commentInput" placeholder="Write your comment here...">
                    <button id="addCommentBtn">Add</button>
                </div>
            </div>
    </div>
  `,
    "img-section": `
    <div class="img-section custom-section" id="img_${Date.now()}">
      <button class="deleteBtn" style="float:right;">🗑️</button>
      <h2 contenteditable="true">Image</h2>
      <p>Image section content here...</p>
    </div>
  `,
    "graph-section": `
    <div class="graph-section custom-section" id="graph_${Date.now()}">
      <button class="deleteBtn" style="float:right;">🗑️</button>
      <h2 contenteditable="true">Graph</h2>
      <p>Graph section content here...</p>
    </div>
  `,
    "notes-section": `
    <div class="notes-section custom-section" id="notes_${Date.now()}">
      <button class="deleteBtn" style="float:right;">🗑️</button>
      <h2 contenteditable="true">Notes</h2>
      <p>Notes section content here...</p>
    </div>
  `,
    "map-section": `
    <div class="map-section custom-section" id="map_${Date.now()}">
      <button class="deleteBtn" style="float:right;">🗑️</button>
      <h2 contenteditable="true">Map</h2>
      <p>Map section content here...</p>
    </div>
  `
};

document.querySelectorAll('#sectionOptions button').forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        const html = sectionTemplates[type];
        if (!html) return;

        document.querySelector('.main-body').insertAdjacentHTML('beforeend', html);
        saveCustomSections();
        attachDeleteLogic();
    });
});

/* editBtn.addEventListener('click', () => {
    editMode = !editMode;
    editControls.style.display = editMode ? 'block' : 'none';

    // Show/hide Save and Add buttons
    saveBtn.style.display = editMode ? 'inline-block' : 'none';
    addSectionBtn.style.display = editMode ? 'inline-block' : 'none';
    addSectionContainer.style.display = editMode ? 'inline-block' : 'none';
    editBtn.style.display = editMode ? 'none' : 'inline-block';
    document.body.classList.toggle('edit-mode-active', editMode);

    document.querySelectorAll('.main-body > div').forEach(section => {
        if (editMode) {
            if (!section.querySelector('.deleteBtn')) {
                const delBtn = document.createElement('img');
                delBtn.src = 'images/delete.png';
                delBtn.alt = 'Delete';
                delBtn.className = 'deleteBtn';
                delBtn.title = 'Delete this section';
                delBtn.style.float = 'left';
                delBtn.style.width = '25px'
                delBtn.style.height = '25px'
                delBtn.style.marginRight = '5px'
                delBtn.addEventListener('click', () => section.remove());
                section.prepend(delBtn);
            }
        } else {
            const btn = section.querySelector('.deleteBtn');
            if (btn) btn.remove();
        }
    })
}) */

editBtn.addEventListener('click', () => {
    editMode = !editMode;
    editControls.style.display = editMode ? 'block' : 'none';

    saveBtn.style.display = editMode ? 'inline-block' : 'none';
    addSectionBtn.style.display = editMode ? 'inline-block' : 'none';
    addSectionContainer.style.display = editMode ? 'inline-block' : 'none';
    editBtn.style.display = editMode ? 'none' : 'inline-block';
    document.body.classList.toggle('edit-mode-active', editMode);

    // Select all sections regardless of nesting
    const allSections = document.querySelectorAll(
        '.main-body > .doc-section, .row-section > .img-section, .row-section > .graph-section, .row-section > .notes-section, .row-section > .map-section'
    );

    allSections.forEach(section => {
        if (editMode) {
            if (!section.querySelector('.deleteBtn')) {
                const delBtn = document.createElement('img');
                delBtn.src = 'images/delete.png';
                delBtn.alt = 'Delete';
                delBtn.className = 'deleteBtn';
                delBtn.title = 'Delete this section';
                delBtn.style.float = 'left';
                delBtn.style.width = '25px';
                delBtn.style.height = '25px';
                delBtn.style.marginRight = '5px';
                delBtn.style.cursor = 'pointer';
                delBtn.addEventListener('click', () => section.remove());
                section.prepend(delBtn);
            }
        } else {
            const btn = section.querySelector('.deleteBtn');
            if (btn) btn.remove();
        }
    });
});


saveBtn.addEventListener('click', () => {
    // Exit edit mode
    editMode = false;

    // Hide controls
    editControls.style.display = 'none';
    saveBtn.style.display = 'none';
    document.getElementById('addSectionContainer').style.display = 'none';
    document.getElementById('editButton').style.display = 'inline-block';
    document.body.classList.toggle('edit-mode-active', editMode);

    // Remove all delete buttons
    document.querySelectorAll('.deleteBtn').forEach(btn => btn.remove());

    // Save custom sections
    saveCustomSections();

    // Save editable titles (already handled via `input` listeners)
});

// Color picker events + persistence
const bgColorInput = document.getElementById('bgColorInput');
const secondColorInput = document.getElementById('secondColorInput');
const sectionColorInput = document.getElementById('sectionColorInput');
const txtColorInput = document.getElementById('txtColorInput');

// Set and store
function setColor(key, cssVar, input) {
    const color = input.value;
    document.documentElement.style.setProperty(cssVar, color);
    localStorage.setItem(key, color);
}

bgColorInput.addEventListener('input', e => setColor('bgColor', '--bg-color', e.target));
secondColorInput.addEventListener('input', e => setColor('secBgColor', '--sec-bg-color', e.target));
sectionColorInput.addEventListener('input', e => setColor('sectionColor', '--section-color', e.target));
txtColorInput.addEventListener('input', e => setColor('textColor', '--text-color', e.target));

// Add new section
document.getElementById('addSectionBtn').addEventListener('click', () => {
    const sectionName = prompt("Enter section title:");
    if (!sectionName) return;

    const newId = 'section_' + Date.now();
    const sectionHTML = `
    <div class="custom-section" id="${newId}">
      <button class="deleteBtn" style="float:right;">🗑️</button>
      <h2 contenteditable="true">${sectionName}</h2>
      <p>New section content here...</p>
    </div>
  `;

    document.querySelector('.main-body').insertAdjacentHTML('beforeend', sectionHTML);

    saveCustomSections(); // store updated sections
    attachDeleteLogic();  // make sure delete buttons work
});

function saveCustomSections() {
    const sections = document.querySelectorAll('.custom-section');
    const sectionData = Array.from(sections).map(sec => sec.outerHTML);
    localStorage.setItem('customSections', JSON.stringify(sectionData));
}

function saveCustomSections() {
    const sections = document.querySelectorAll('.custom-section');
    const sectionData = Array.from(sections).map(sec => sec.outerHTML);
    localStorage.setItem('customSections', JSON.stringify(sectionData));
}

function loadCustomSections() {
    const sectionData = JSON.parse(localStorage.getItem('customSections') || '[]');
    const mainBody = document.querySelector('.main-body');

    sectionData.forEach(html => {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        const section = temp.firstElementChild;
        mainBody.appendChild(section);
    });

    attachDeleteLogic();
}

// Load saved colors from localStorage
function applyStoredColors() {
    const colors = {
        bgColor: '--bg-color',
        secBgColor: '--sec-bg-color',
        sectionColor: '--section-color',
        textColor: '--text-color'
    };

    for (const key in colors) {
        const savedColor = localStorage.getItem(key);
        if (savedColor) {
            document.documentElement.style.setProperty(colors[key], savedColor);
            const inputId = {
                bgColor: 'bgColorInput',
                secBgColor: 'secondColorInput',
                sectionColor: 'sectionColorInput',
                textColor: 'txtColorInput'
            }[key];
            document.getElementById(inputId).value = savedColor;
        }
    }
}

// Select all contenteditable elements
const editableTitles = document.querySelectorAll('[contenteditable="true"]');

editableTitles.forEach((el) => {
    const key = 'tempTitle_' + el.id;

    // Load saved title (if any)
    const saved = localStorage.getItem(key);
    if (saved) {
        el.textContent = saved;
    }

    // Save on edit
    el.addEventListener('input', () => {
        localStorage.setItem(key, el.textContent.trim());
    });
});

// Generating chart for the documents
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

    const workbook = XLSX.read(file.content, { type: 'base64' });
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

imageInput.onchange = function () {
    const file = imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
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