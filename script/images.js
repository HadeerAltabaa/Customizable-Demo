function handleImageUpload(sectionId) {
    const input = document.getElementById(`imageInput_${sectionId}`);
    const previewImage = document.getElementById(`previewImage_${sectionId}`);

    if (!input) return;

    const file = input.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function (event) {
            let storedImages = JSON.parse(localStorage.getItem("storedImages")) || {};
            const base64Image = event.target.result;

            previewImage.src = base64Image;

            storedImages[sectionId] = base64Image;
            localStorage.setItem("storedImages", JSON.stringify(storedImages));
        };

        reader.readAsDataURL(file); // Converts to Base64
    }
}

const storedImages = JSON.parse(localStorage.getItem("storedImages")) || {}

for (let sectionId in storedImages) {
    const previewImage = document.getElementById(`previewImage_${sectionId}`);

    previewImage.src = storedImages[sectionId]
}