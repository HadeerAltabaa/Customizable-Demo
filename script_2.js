// Update Images Upload
const previewLogo = document.getElementById('previewLogo');
function logoInputHandler(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const base64Image = e.target.result;
        previewLogo.src = base64Image;
        localStorage.setItem('logoImage', base64Image);
    };

    reader.readAsDataURL(file);
};

window.addEventListener("DOMContentLoaded", () => {
    const savedLogo = localStorage.getItem('logoImage');
    if (savedLogo) {
        previewLogo.src = savedLogo;
    }
});

// Preview Excel Sheets
const fileInput = document.getElementById('fileInput');
function handlePreviewingSheets(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        const arrayBuffer = event.target.result;

        const base64Reader = new FileReader();
        base64Reader.onload = function(e) {
            localStorage.setItem('excelBase64', e.target.result);
        }
        base64Reader.readAsDataURL(file);

        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, {type:'array'});
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const html = XLSX.utils.sheet_to_html(sheet);
        document.getElementById('filesPresentPanel').innerHTML = html;
    };
    reader.readAsArrayBuffer(file);
}