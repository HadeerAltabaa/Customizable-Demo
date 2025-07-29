const img = document.querySelector("#previewImage")

function onImageClick() {
    const rect = img.getBoundingClientRect();
    const relativeX = mouseX - rect.left;
    const relativeY = mouseY - rect.top;

    let isTop = rect.bottom / 2 > relativeY
    let isLeft = rect.right / 2 > relativeX
    let isBottom = !isTop
    let isRight = !isLeft

    area = 0

    if (isTop && isLeft)
        area = 1

    if (isTop && isRight)
        area = 2

    if (isBottom && isLeft)
        area = 3

    if (isBottom && isRight)
        area = 4

    console.log(area);
    console.log({
        isTop,
        isLeft,
        isBottom,
        isRight
    })
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
    const rect = canvas.getBoundingClientRect();

    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;

    if (humanImage.complete) {
        drawImageAt(relativeX, relativeY);
    } else {
        humanImage.onload = () => drawImageAt(relativeX, relativeY);
    }
});

function drawImageAt(x, y) {
    const scaleFactor = 0.05; // Scale down to 12.5%
    const scaledWidth = humanImage.width * scaleFactor;
    const scaledHeight = humanImage.height * scaleFactor;

    // Draw centered at click location
    ctx.drawImage(humanImage, x - scaledWidth / 2, y - scaledHeight / 2, scaledWidth, scaledHeight);
}