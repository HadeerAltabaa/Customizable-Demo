const fileInput = document.getElementById('fileInput');
const fileGrid = document.getElementById('fileGrid');
const preview = document.getElementById('preview');
const fileLimitInput = document.querySelector('input[type="number"]');
const storageKey = 'uploadedExcelFiles';

let fileLimit = 0;

// Load from localStorage
window.addEventListener('load', () => {
  const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
  stored.forEach(f => renderFileButton(f));
});

// Update file limit
fileLimitInput.addEventListener('input', () => {
  fileLimit = parseInt(fileLimitInput.value, 10) || 0;
  clearAllFiles();
});

// File input handler
fileInput.addEventListener('change', () => {
  const selected = Array.from(fileInput.files);
  const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');

  if (fileLimit && stored.length + selected.length > fileLimit) {
    alert(`You can only upload ${fileLimit} file(s) in total.`);
    fileInput.value = '';
    return;
  }

  selected.forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      const fileObj = {
        name: file.name,
        type: file.type,
        content: reader.result
      };

      const updated = [...stored, fileObj];
      localStorage.setItem(storageKey, JSON.stringify(updated));
      renderFileButton(fileObj);
    };
    reader.readAsArrayBuffer(file);
  });

  fileInput.value = '';
});

// Render file button
function renderFileButton(file) {
  const wrapper = document.createElement('div');
  wrapper.className = 'file-icon';
  wrapper.innerHTML = `
    <button class="file-item">${file.name}</button>
    <button class="delete-btn" title="Delete file">&times;</button>
  `;

  wrapper.querySelector('.file-item').addEventListener('click', () => {
    previewExcelFile(file);
  });

  wrapper.querySelector('.delete-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    deleteFile(file.name);
  });

  fileGrid.appendChild(wrapper);
}

// Preview first 6 rows
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
}

// Delete file from storage
function deleteFile(fileName) {
  let stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
  stored = stored.filter(f => f.name !== fileName);
  localStorage.setItem(storageKey, JSON.stringify(stored));
  fileGrid.innerHTML = '';
  stored.forEach(f => renderFileButton(f));
  preview.innerHTML = '<p>Select a file from the right to preview here.</p>';
}

// Clear all on file limit change
function clearAllFiles() {
  localStorage.removeItem(storageKey);
  fileGrid.innerHTML = '';
  preview.innerHTML = '<p>Upload and add your Excel Sheets here...</p>';
}
