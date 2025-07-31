// const input = document.getElementById('imageInput');
// const previewImage = document.getElementById('previewImage');

// input.onchange = function() {
//     previewImage.src = URL.createObjectURL(input.files[0]);
//     localStorage.setItem('storedImage', previewImage.src);
// }

function handleImageUpload(sectionId) {
    const input = document.getElementById(`imageInput_${sectionId}`);
    const previewImage = document.getElementById(`previewImage_${sectionId}`);

    if (!input) return;

    // Load saved image if exists from localStorage
    const savedImage = localStorage.getItem(`storedImage_${sectionId}`);
    if (savedImage) {
        previewImage.src = savedImage;
    }

    input.addEventListener('change', function () {
        const file = input.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            previewImage.src = imageUrl;

            // Save the image URL to localStorage
            const read = new FileReader();
            read.onload = function (e) {
                localStorage.setItem(`storedImage_${sectionId}`, e.target.result);
            };
            read.readAsDataURL(file);
        }
    });
}