const documentSections = document.querySelectorAll('[id^="docSection_"]');

function reloadMockBoxes() {
    documentSections.forEach((section) => {
        let id = section.id.split("_")[1];

        // Find the existing div inside the section
        const wrapperForm = section.querySelector(`#actions-box-${id}`);
        const boxes = mockBoxes[id]
        let inputs = []

        wrapperForm.innerHTML = ""

        if(!boxes)
            return

        boxes.forEach(name => {
            const input = document.createElement('input');
            input.placeholder = name;
            input.name = name;
            input.id = name
            input.className = `mockdata-${id}`;
            // Optionally set input.type here if needed

            inputs.push(input)

            wrapperForm.appendChild(input);
        });

        const button = document.createElement('button')
        button.innerText = "Send"
        button.type = "submit"

        wrapperForm.autocomplete = "on"
        

        wrapperForm.onsubmit = (e) => {
            e.preventDefault(); 
            sendMockData(id);

            inputs.forEach(i => i.value = "")


        };

        wrapperForm.appendChild(button)
    });
}

reloadMockBoxes()