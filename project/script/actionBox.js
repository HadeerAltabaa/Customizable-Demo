const documentSections = document.querySelectorAll('[id^="docSection_"]');

documentSections.forEach((section) => {
    let id = section.id.split("_")[1];

    // Find the existing div inside the section
    const wrapperDiv = section.querySelector(`#actions-box-${id}`);

    mockDataDefualtInputs.forEach(field => {
        const input = document.createElement('input');
        input.placeholder = field.placeholder;
        input.name = field.name;
        input.className = `mockdata-${id}`;
        // Optionally set input.type here if needed

        wrapperDiv.appendChild(input);
    });

    const button = document.createElement('button')
    button.innerText = "Send"
    button.onclick = () => sendMockData(id)

    wrapperDiv.appendChild(button)
});
