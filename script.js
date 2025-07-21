const fileInput = document.getElementById('fileInput');
const fileGrid = document.getElementById('fileGrid');
const preview = document.getElementById('preview');
const fileLimitInput = document.getElementById('fileLimit');
const noFilesPanel = document.getElementById('noFilesPanel');
const filesPresentPanel = document.getElementById('filesPresentPanel');
const commentInput = document.getElementById("commentInput");
const addCommentBtn = document.getElementById("addCommentBtn");
const commentList = document.getElementById("commentList");

const storageKey = 'uploadedExcelFiles';
let fileLimit = parseInt(fileLimitInput.value, 10) || 1;

// Load stored files on page load
window.addEventListener('load', () => {
    const storedFiles = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (storedFiles.length > 0) {
        switchToFilesPanel();
        storedFiles.forEach(renderFileButton);
    } else {
        switchToEmptyPanel();
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
});

addCommentBtn.addEventListener("click", () => {
    const commentText = commentInput.value.trim();

    if (commentText !== "") {
        const comment = document.createElement("div");
        comment.className = "comment";
        comment.textContent = commentText;

        commentList.appendChild(comment);
        commentInput.value = "";
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

// Preview first 6 rows of Excel sheet
function previewExcelFile(file) {
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

    // Re-add comment list inside preview
    const commentList = document.createElement("div");
    commentList.id = "commentList";
    commentList.className = "comment-list";
    preview.appendChild(commentList);

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