// Handle logo upload - Working Perfectly
const logoInput = document.getElementById('logoInput');
const previewLogo = document.getElementById('previewLogo');
const logoFooter = document.getElementById('logoFooter');

function changeLogoHandler(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const base64Image = e.target.result;
        previewLogo.src = base64Image;
        logoFooter.src = base64Image;
        localStorage.setItem(`${projectID}-logoImage`, base64Image);
    };
    reader.readAsDataURL(file);
}

// Load stored files on page load
window.addEventListener('DOMContentLoaded', () => {
    const storedLogo = localStorage.getItem(`${projectID}-logoImage`);
    if (storedLogo) {
        previewLogo.src = storedLogo;
        logoFooter.src = storedLogo;
    }
});