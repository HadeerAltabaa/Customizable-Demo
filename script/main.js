let mouseX = 0;
let mouseY = 0;
let area = 0;
let selectedFile = null;
let allFiles = {}

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
})
