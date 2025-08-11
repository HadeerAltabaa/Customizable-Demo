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
}

let isDrawing = false
let startX = 0
let startY = 0
let currentX = 0
let currentY = 0

function getCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    // map from client coords to canvas internal pixels (handles CSS scaling / DPR)
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

canvas.addEventListener("mousedown", (e) => {
    isDrawing = false;
    const pos = getCanvasCoords(e);
    startX = pos.x;
    startY = pos.y;
});

// attach move/up to window so dragging outside the canvas still works
window.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;
    const pos = getCanvasCoords(e);
    currentX = pos.x;
    currentY = pos.y;
    drawAreaBox(ctx, startX, startY, currentX, currentY);
});

window.addEventListener("mouseup", (e) => {
    if (!isDrawing) return;
    isDrawing = false;
    // final draw (already done in mousemove) — if you want to persist the box,
    // push it into an array here before clearing on next draw.
});

function drawAreaBox(ctx, x1, y1, x2, y2) {
    // clear the whole canvas (use canvas.width/height - that's internal pixel size)
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const x = Math.min(x1, x2);
    const y = Math.min(y1, y2);
    const w = Math.abs(x2 - x1);
    const h = Math.abs(y2 - y1);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);
}