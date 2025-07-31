// Editing Mode
const editBtn = document.getElementById('editButton');
const addSectionBtn = document.getElementById('addSectionBtn');
const saveBtn = document.getElementById('saveBtn');
const editControls = document.getElementById('editControls');
const addSectionContainer = document.getElementById('addSectionContainer');

let editMode = false;

const sectionTemplates = {
    "doc-section": () => {
        // Generate a unique ID for the section
        const uniqueId = Date.now() + Math.floor(Math.random() * 1000);

        // Return the HTML for the document section
        return {
            html: `
            <div class="section-header">
                <h2 id="editableDoc" contenteditable="true">Documents</h2>
            </div>
            <!-- when no files are uploaded -->
            <div class="no-files-panel" id="noFilesPanel_${uniqueId}">
                <p>Please add your excel sheets from here...</p>
                <div class="upload-box">
                    <label for="fileInput_${uniqueId}">Select</label>
                    <input type="file" id="fileInput_${uniqueId}" accept=".xlsx,.xls,.csv" max="1"
                        onchange="handleFileUpload(this, '${uniqueId}'); loadCommentsFromLocalStorage(this)">
                </div>
            </div>

            <!-- when files are uploaded -->
            <div class="files-present-panel" id="filesPresentPanel_${uniqueId}" style="display: none;">
                <p class="info-text">This is your document</p>
                <div class="file-preview-layout">
                    <div class="file-grid" id="fileGrid_${uniqueId}">

                    </div>

                    <div class="preview-panel" id="preview_${uniqueId}">
                        <!-- Preview content injected via JS -->
                        <h2 id="commentsTitle_${uniqueId}" style="display: none;">Comments</h2>
                        <div id="commentList_${uniqueId}" class="comment-list"></div>
                    </div>
                </div>

                <div class="info-actions-row">
                    <div class="offers-container">
                        <p class="offers-text">ID for customers</p>
                        <div class="offers-preview">
                            <p name="previewID" id="previewID">This part will represent the offers to the customer.</p>
                        </div>
                    </div>

                    <div class="comment-container">
                        <p class="comment-text">Comment</p>
                        <div class="comment-box">
                            <input type="text" id="commentInput_${uniqueId}" placeholder="Write your comment here...">
                            <button onclick="onAddCommentButtonClicked(this)" type="button" id="addCommentBtn_${uniqueId}">Add</button>
                        </div>
                    </div>
                </div>
            </div>`, id: `docSection_${uniqueId}`
        };
    },
    "img-section": () => {
        const uniqueId = Date.now() + Math.floor(Math.random() * 1000);
        return{ 
        html: `
        <div class="custom-section image-section" id="image_${uniqueId}">
            <div class="section-header">
                <h2 id="editableImage" contenteditable="true">Image</h2>
            </div>
            <div class="img-preview">
                <div class="image-wrapper">
                    <button type="button" id="downloadImageBtn" title="Download an Image">
                        <i class="fa-solid fa-circle-down"></i>
                    </button>
                    <label for="imageInput_${uniqueId}">
                        <img src="images/map.png" id="previewImage_${uniqueId}" alt="Preview an Image">
                    </label>
                </div>
                <input type="file" id="imageInput_${uniqueId}" accept="image/*" onchange="handleImageUpload('${uniqueId}');">
            </div>
        </div>
        `, id: `image_${uniqueId}`
        }
    },
    "graph-section": () => {
        const uniqueId = Date.now() + Math.floor(Math.random() * 1000);

        return {
            html: `
            <div class="custom-section graph-section" id="graph_${uniqueId}">
                <div class="section-header">
                    <h2 id="editableGraph" contenteditable="true">Graph</h2>
                </div>
                <div class="graph-preview">
                    <div class="graph-wrapper">
                        <button type="button" id="downloadGraphBtn" title="Download Graph">
                            <i class="fa-solid fa-circle-down"></i>
                        </button>
                        <canvas id="generatedChart_${uniqueId}" width="400" height="200"></canvas>
                    </div>
                </div>
            </div>
            `, id: `graph_${uniqueId}`
        }
    },
    "notes-section": () => {

        const uniqueId = Date.now() + Math.floor(Math.random() * 1000);

        return {
            html: `
                <div id="notesSection_${uniqueId}">
                    <div class="section-header">
                        <h2 id="editableNotes" contenteditable="true">Notes</h2>
                    </div>
                    <div class="notes-preview" id="notesContainer-notesInput_${uniqueId}"></div>
                    <div class="notes-adding">
                        <textarea id="notesInput_${uniqueId}" placeholder="Write your notes here..."></textarea>
                        <button onClick="addNotes('notesInput_${uniqueId}')" type="button" id="addNotesBtn">Add</button>
                    </div>
                </div>
            `, id: `notesSection_${uniqueId}`
        }
    },
    "map-section": () => {
        const uniqueId = Date.now() + Math.floor(Math.random() * 1000);

        return {
            html: `
                <div class="map-section custom-section" id="map_${uniqueId}">
                    <div class="section-header">
                        <h2 id="editableMap" contenteditable="true">Map</h2>
                    </div>
                    <div class="map-preview">
                        <div class="map-wrapper">
                            <button type="button" id="downloadMapBtn" title="Download Map">
                                <i class="fa-solid fa-circle-down"></i>
                            </button>
                            <iframe id="previewMap_${uniqueId}" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.123456789012!2d-122.419415684681!3d37.774929279759!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c8b8b8b8b%3A0x8b8b8b8b8b8b8b8b!2sSan%20Francisco%2C%20CA%2094105%2C%20USA!5e0!3m2!1sen!2sin!4v1616161616161" allowfullscreen="" loading="lazy"></iframe>
                            <input type="url" id="mapInput_${uniqueId}" placeholder="Search for a location...">
                        </div>
                    </div>
                </div>
            `, id: `map_${uniqueId}`
        }
    }
};

document.querySelectorAll('#sectionOptions button').forEach(btn => {
    btn.addEventListener('click', () => {
        const section = document.createElement("div")
        const type = btn.dataset.type;
        const { html, id } = sectionTemplates[type]();
        if (!html) return;
        section.id = id
        section.className = `${type} custom-section`

        section.innerHTML = html

        if (editMode) {
            if (!section.querySelector('.deleteBtn')) {
                const delBtn = document.createElement('img');
                delBtn.src = 'images/delete.png';
                delBtn.alt = 'Delete';
                delBtn.className = 'deleteBtn';
                delBtn.id = `delBtn-${section.id}`
                delBtn.title = 'Delete this section';
                delBtn.style.float = 'left';
                delBtn.style.width = '25px';
                delBtn.style.height = '25px';
                delBtn.style.marginRight = '5px';
                delBtn.style.cursor = 'pointer';
                delBtn.addEventListener('click', (e) => {
                    let customSections = JSON.parse(localStorage.getItem("customSections"))

                    if (customSections[section.id]) {
                        delete customSections[section.id]
                        localStorage.setItem("customSections", JSON.stringify(customSections))
                    }

                    document.querySelector(`li#nav-${section.id}`)?.remove();
                    section.remove(section.id)
                });
                section.querySelector(".section-header").prepend(delBtn);
            }
        }

        document.querySelector('.main-body').appendChild(section)
        saveCustomSections();
        //enterEditMode()
        // attachDeleteLogic();
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

function enterEditMode() {
    const sectionHeaders = document.querySelectorAll(".section-header")

    editMode = !editMode;
    editControls.style.display = editMode ? 'block' : 'none';

    saveBtn.style.display = editMode ? 'inline-block' : 'none';
    addSectionBtn.style.display = editMode ? 'inline-block' : 'none';
    addSectionContainer.style.display = editMode ? 'inline-block' : 'none';
    editBtn.style.display = editMode ? 'none' : 'inline-block';
    document.body.classList.toggle('edit-mode-active', editMode);

    // Select all sections regardless of nesting
    // const allSections = document.querySelectorAll(
    //     '.main-body > .doc-section, .row-section > .img-section, .row-section > .graph-section, .row-section > .notes-section, .row-section > .map-section'
    // );

    sectionHeaders.forEach(section => {
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
                delBtn.addEventListener('click', (e) => {
                    let customSections = JSON.parse(localStorage.getItem("customSections") || "{}")

                    if (customSections[section.parentElement.id]) {
                        delete customSections[section.parentElement.id]
                        localStorage.setItem("customSections", JSON.stringify(customSections))
                    }

                    document.querySelector(`li#nav-${section.parentElement.id}`)?.remove();
                    section.parentElement.remove(section.parentElement.id)
                });
                section.prepend(delBtn);
            }
        } else {
            const btn = section.querySelector('.deleteBtn');
            if (btn) btn.remove();
        }
    });
}

editBtn.addEventListener('click', () => enterEditMode());

// Dinamic navigation bar
const sectionHeaders = document.querySelectorAll(".section-header")
const sections = []

sectionHeaders.forEach(section => {
    sections.push(section.parentElement)
})

sections.forEach(section => {
    createNavElement(section.id, section.querySelector(".section-header h2").innerText);
});

function createNavElement(id, title) {
    const navbar = document.querySelector('.nav-bar ul');
    const li = document.createElement('li');
    li.id = `nav-${id}`;
    li.innerHTML = `<a href="#${id}">${title}</a>`
    navbar.appendChild(li);
}

// Save button functionality
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
function setColor(key, cssVar, value) {
    const color = value;
    document.documentElement.style.setProperty(cssVar, color);
    localStorage.setItem(key, color);
}

function getColor(key, cssVar) {
    if (localStorage.getItem(key)) {
        let color = localStorage.getItem(key)
        return color
    }

    const rootStyles = getComputedStyle(document.documentElement);
    const color = rootStyles.getPropertyValue(cssVar).trim();

    return color
}

// init base colors
function InitColors() {
    bgColorInput.value = getColor("bgColor", "--bg-color")
    secondColorInput.value = getColor("secBgColor", "--sec-bg-color")
    sectionColorInput.value = getColor("sectionColor", "--section-color")
    txtColorInput.value = getColor("textColor", "--text-color")

    setColor("bgColor", "--bg-color", bgColorInput.value)
    setColor("secBgColor", "--sec-bg-color", secondColorInput.value)
    setColor("sectionColor", "--section-color", sectionColorInput.value)
    setColor("textColor", "--text-color", txtColorInput.value)
}

InitColors()

bgColorInput.addEventListener('input', e => setColor('bgColor', '--bg-color', e.target.value));
secondColorInput.addEventListener('input', e => setColor('secBgColor', '--sec-bg-color', e.target.value));
sectionColorInput.addEventListener('input', e => setColor('sectionColor', '--section-color', e.target.value));
txtColorInput.addEventListener('input', e => setColor('textColor', '--text-color', e.target.value));


function saveCustomSections() {
    const sectionData = document.querySelectorAll(".custom-section")

    let sections = {}

    sectionData.forEach(section => {
        sections[section.id] = section.outerHTML
    })

    localStorage.setItem('customSections', JSON.stringify(sections));
}

function loadCustomSections() {
    const sectionData = JSON.parse(localStorage.getItem('customSections') || '{}');
    const mainBody = document.querySelector('.main-body');

    for (let id in sectionData) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(sectionData[id], "text/html");

        const node = doc.body.firstChild;

        mainBody.appendChild(node);
    }

    // attachDeleteLogic();
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
const notesInput = document.getElementById("notesInput");
const addBtn = document.getElementById("addNotesBtn");

function getNotes(id) {
    const notes = JSON.parse(localStorage.getItem(`notes-${id}`)) || []
    return notes
}

let notes = {}
notes[notesInput.id] = getNotes(notesInput.id);
renderNotes(notesInput.id)
loadCustomSections()

const noteSections = document.querySelectorAll(".notes-section.custom-section textarea")

noteSections.forEach(section => {
    notes[section.id] = getNotes(section.id)
    renderNotes(section.id)
});

function saveNotes(notesID) {
    localStorage.setItem(`notes-${notesID}`, JSON.stringify(notes[notesID]));
    renderNotes(notesID);
}

function renderNotes(uniqueId) {

    const notesContainer = document.getElementById(`notesContainer-${uniqueId}`);
    notesContainer.innerHTML = '';

    for (let index in notes[uniqueId]) {
        let note = notes[uniqueId][index]
        const noteDiv = document.createElement("div");
        noteDiv.className = "note-item";

        const editBtn = document.createElement("button");
        editBtn.innerHTML = '✏️';
        editBtn.onclick = () => {
            const newText = prompt("Edit your note:", note);
            if (newText !== null) {
                notes[uniqueId][index] = newText;
                saveNotes(uniqueId);
            }
        };

        const textSpan = document.createElement('div');
        textSpan.className = 'note-text';
        textSpan.innerText = note;

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.onclick = () => {
            if (confirm('Delete this note?')) {
                notes[uniqueId].splice(index, 1);
                saveNotes(uniqueId);
            }
        };

        noteDiv.appendChild(editBtn);
        noteDiv.appendChild(textSpan);
        noteDiv.appendChild(deleteBtn);

        notesContainer.appendChild(noteDiv);
    };
}

addBtn.onclick = () => {
    addNotes(notesInput)
};

function addNotes(noteInputID) {
    let noteInput = null
    if (typeof noteInputID == "string") {
        noteInput = document.querySelector(`#${noteInputID}`)

    }
    else {
        noteInput = noteInputID
    }




    const note = noteInput.value.trim();
    if (note) {
        if (!notes[noteInput.id])
            notes[noteInput.id] = []
        notes[noteInput.id].push(note);
        noteInput.value = '';
        saveNotes(noteInput.id);
    }
}

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