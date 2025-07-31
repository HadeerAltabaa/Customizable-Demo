function handleImageUpload(sectionId) {
    const input = document.getElementById(`imageInput_${sectionId}`);
    const previewImage = document.getElementById(`previewImage_${sectionId}`);

    if (!input) return;

    const file = input.files[0];
    if (file) {
        const imageUrl = URL.createObjectURL(file);
        previewImage.src = imageUrl;
        localStorage.setItem(`storedImage_${sectionId}`, imageUrl);
    }
}