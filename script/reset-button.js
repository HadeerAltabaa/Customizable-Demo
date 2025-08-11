function onResetButtonClickReload() {
    onResetButtonClick()
    window.location.reload()
}


function onResetButtonClick() {
    localStorage.clear();
    // Color Reset
    const bgColorInput = document.getElementById('bgColorInput');
    const secondColorInput = document.getElementById('secondColorInput');
    const sectionColorInput = document.getElementById('sectionColorInput');
    const txtColorInput = document.getElementById('txtColorInput');

    baseColors = {
        bg: "#ffffff",
        secBg: "#f0f0f0",
        section: "#057bc6",
        text: "#333333"
    }

    bgColorInput.value = baseColors.bg
    secondColorInput.value = baseColors.secBg
    sectionColorInput.value = baseColors.section
    txtColorInput.value = baseColors.text

    setColor("bgColor", "--bg-color", baseColors.bg)
    setColor("secBgColor", "--sec-bg-color", baseColors.secBg)
    setColor("sectionColor", "--section-color", baseColors.section)
    setColor("textColor", "--text-color", baseColors.text)

    // const defaultInput = { type: 'number', placeholder: 'Amount in SAR', name: 'Amount' };

    // saveToLocalStorage(defaultInput.type, defaultInput.name, defaultInput.placeholder);
    // createInput(defaultInput.type, defaultInput.name, defaultInput.placeholder)
    // createSidebarItem(defaultInput.type, defaultInput.name, defaultInput.placeholder);

}