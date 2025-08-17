const documentSections = document.querySelectorAll('[id^="docSection_"]');

function reloadMockBoxes() {
    documentSections.forEach((section) => {
        let id = section.id.split("_")[1];

        // Find the existing div inside the section
        const wrapperDiv = section.querySelector(`#actions-box-${id}`);
        const boxes = mockBoxes[id]

        wrapperDiv.innerHTML = ""

        if(!boxes)
            return

        boxes.forEach(name => {
            const input = document.createElement('input');
            input.placeholder = name;
            input.name = name;
            input.className = `mockdata-${id}`;
            // Optionally set input.type here if needed

            wrapperDiv.appendChild(input);
        });

        const button = document.createElement('button')
        button.innerText = "Send"
        button.onclick = () => sendMockData(id)

        wrapperDiv.appendChild(button)
    });
}

reloadMockBoxes()