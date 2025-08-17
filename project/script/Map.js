// script/image.js
// Save the uploaded image to the local storage
window.addEventListener('DOMContentLoaded', () => {
    const storedImage = localStorage.getItem(`${projectID}-previewImage`);
    if (storedImage) {
        previewImage.src = storedImage;
    }
});

// 
const img = document.querySelector("#previewImage")

function GetArea(x, y) {
    const rect = img.getBoundingClientRect();
    const relativeX = x - rect.left;
    const relativeY = y - rect.top;


    const areas = JSON.parse(localStorage.getItem(`${projectID}-areas`)) || []
    let isInArea = false

    areas.forEach(_area => {
        // Normalize box coordinates to handle any order of points
        const left = Math.min(_area.x1, _area.x2);
        const right = Math.max(_area.x1, _area.x2);
        const top = Math.min(_area.y1, _area.y2);
        const bottom = Math.max(_area.y1, _area.y2);

        if (relativeX >= left && relativeX <= right && relativeY >= top && relativeY <= bottom) {
            area = _area.title
            isInArea = true
        }
    });

    if(isInArea)
        return area


    let isTop = relativeY < rect.height / 2;
    let isLeft = relativeX < rect.width / 2;
    let isBottom = !isTop;
    let isRight = !isLeft;

    if (isTop && isLeft) area = 1;
    if (isTop && isRight) area = 2;
    if (isBottom && isLeft) area = 3;
    if (isBottom && isRight) area = 4;

    // console.log(area);
    // console.log({
    //     isTop,
    //     isLeft,
    //     isBottom,
    //     isRight
    // })

    return area
}

const draggedHuman = document.getElementById('draggedHuman');
const dropArea = document.getElementById('dropArea');

draggedHuman.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData("text/plain", "human");
});

dropArea.addEventListener('dragover', (e) => {
    e.preventDefault(); // Allow drop
});

const canvas = document.getElementById("imageCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const scale = window.devicePixelRatio || 1;

    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;

    ctx.setTransform(scale, 0, 0, scale, 0, 0); // Reset and scale all future drawing
}

// Run once initially
resizeCanvas();

window.addEventListener("resize", resizeCanvas);

const humanImage = new Image();
humanImage.src = './images/human1.png'; // Your image path here

canvas.addEventListener('drop', (e) => {
    resizeCanvas();
    const rect = canvas.getBoundingClientRect();

    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;

    if (humanImage.complete) {
        drawImageAt(relativeX, relativeY);
    } else {
        humanImage.onload = () => drawImageAt(relativeX, relativeY);
    }
    
    GetArea(e.clientX, e.clientY)
});

function drawImageAt(x, y) {
    const scaleFactor = 0.05; // Scale down to 12.5%
    const scaledWidth = humanImage.width * scaleFactor;
    const scaledHeight = humanImage.height * scaleFactor;

    // Draw centered at click location
    ctx.drawImage(humanImage, x - scaledWidth / 2, y - scaledHeight / 2, scaledWidth, scaledHeight);
    loadAreaBoxes()
}

let isDrawing = false;
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;

canvas.addEventListener("mousedown", (e) => {
    if(isEditingMap) isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
});

canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;
    if(!isEditingMap) isDrawing = false

    const rect = canvas.getBoundingClientRect();
    currentX = e.clientX - rect.left;
    currentY = e.clientY - rect.top;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear canvas
    loadAreaBoxes()
    drawAreaBox("#000000", "", ctx, startX, startY, currentX, currentY);
});

canvas.addEventListener("mouseup", () => {
    if(!isEditingMap) return
    isDrawing = false;
    showAreaPopup(({ title, color }) => {
        saveAreaBox(title, color, startX, startY, currentX, currentY)
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear canvas
        loadAreaBoxes()
    }, () => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear canvas
        loadAreaBoxes()
    })
});

function drawAreaBox(color, title, ctx, x1, y1, x2, y2) {
    const x = Math.min(x1, x2);
    const y = Math.min(y1, y2);
    const w = Math.abs(x2 - x1);
    const h = Math.abs(y2 - y1);

    // Fill with 30% opacity
    ctx.fillStyle = hexToRgba(color, 0.3);
    ctx.fillRect(x, y, w, h);

    // Stroke outline
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    if (title) {
        ctx.fillStyle = color;
        ctx.font = '16px sans-serif';
        ctx.textBaseline = 'bottom';  // Align text baseline to bottom for placement above box
        ctx.fillText(title, x, y - 5); // 5px above the box top-left corner
    }
}

// Helper function to convert hex color to rgba with alpha
function hexToRgba(hex, alpha) {
    // Remove '#' if present
    hex = hex.replace('#', '');

    // Parse r,g,b
    let r, g, b;
    if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
        r = parseInt(hex.slice(0,2), 16);
        g = parseInt(hex.slice(2,4), 16);
        b = parseInt(hex.slice(4,6), 16);
    } else {
        // fallback to black
        r = g = b = 0;
    }

    return `rgba(${r},${g},${b},${alpha})`;
}


function saveAreaBox(title, color, x1, y1, x2, y2) {
    const areaBoxes = JSON.parse(localStorage.getItem(`${projectID}-areas`)) || []

    areaBoxes.push({
        title,
        color,
        x1,
        y1,
        x2,
        y2,
    })

    localStorage.setItem(`${projectID}-areas`, JSON.stringify(areaBoxes))
}

function loadAreaBoxes() {
    let areaBoxes = JSON.parse(localStorage.getItem(`${projectID}-areas`)) || []
    const sidebarAreaList = document.getElementById('sidebarAreaList');

    sidebarAreaList.innerHTML = "<h3>Areas:</h3>"
    
    areaBoxes.forEach(area => {
        drawAreaBox(area.color, area.title, ctx, area.x1, area.y1, area.x2, area.y2);
        const item = document.createElement('div');
        item.className = 'sidebar-input-item';

        deleteArea = (areaTitle) => {
            areaBoxes = areaBoxes.filter((area) => area.title != areaTitle)
            localStorage.setItem(`${projectID}-areas`, JSON.stringify(areaBoxes))
            item.remove()
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear canvas
            loadAreaBoxes()
        }
    
        item.innerHTML = `
            <span>${area.title}</span>
            <button onclick="deleteArea('${area.title}')">&times;</button>
        `;
    
        sidebarAreaList.appendChild(item);
    });
}

function showAreaPopup(onConfirm, onCancel) {
    // Remove existing popup if any
    const existing = document.getElementById("area-popup");
    if (existing) existing.remove();

    // Create popup container
    const popup = document.createElement("div");
    popup.id = "area-popup";

    popup.innerHTML = `
        <div>
            <h2>Create Area</h2>
            <label>Title</label>
            <input type="text" id="area-title" placeholder="Enter title">
            <label>Color</label>
            <input type="color" id="area-color">
            <div class="buttons">
            <button id="cancel-btn">Cancel</button>
            <button id="confirm-btn">Confirm</button>
            </div>
        </div>
    `;

    document.body.appendChild(popup);

    // Event listeners
    document.getElementById("cancel-btn").addEventListener("click", () => {
        onCancel()
        popup.remove();
    });

    document.getElementById("confirm-btn").addEventListener("click", () => {
        const title = document.getElementById("area-title").value.trim();
        const color = document.getElementById("area-color").value;
        if (!title) {
            alert("Please enter a title");
            return;
        }
        onConfirm({ title, color });
        popup.remove();
    });
}

loadAreaBoxes()