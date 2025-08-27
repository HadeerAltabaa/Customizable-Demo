// // Load and Initialize
// window.onload = function () {
//     const savedInputs = JSON.parse(localStorage.getItem('customInputs')) || [];

//     // Default input
//     const defaultInput = {type: 'number', placeholder: 'Amount in SAR'};
//     const hasDefault = savedInputs.some(
//         input => input.type === defaultInput.type && input.placeholder === defaultInput.placeholder
//     );

//     if (!hasDefault) {
//         savedInputs.unshift(defaultInput);
//         localStorage.setItem('customInputs', JSON.stringify(savedInputs));
//     }

//     // Render inputs
//     savedInputs.forEach( input => createInputElement(input.type, input.placeholder));
// }

// // Add custom inputs
// function addCustomInput() {
//     const type = document.getElementById('inputType').value.trim() || 'text';
//     const placeholder = document.getElementById('inputPlaceholder').value.trim() || '';

//     createInputElement(type, placeholder);
//     saveToLocalstorage(type, placeholder);
// }

// // Creat input elements
// function createInputElement(type, placeholder) {
//     const wrapper = document.createElement("div");
//     wrapper.className = "input-wrapper";

//     const newInput = document.createElement("input");
//     newInput.type = type;
//     newInput.className = "input-element"
//     newInput.placeholder = placeholder;
//     newInput.required = true;

//     const deleteBtn = document.createElement('button');
//     deleteBtn.textContent = 'Delete';
//     deleteBtn.onclick = function () {
//         wrapper.remove();
//         removeFromLocalStorage(type, placeholder);
//     }

//     wrapper.appendChild(newInput);
//     wrapper.appendChild(deleteBtn);
//     document.getElementById("custom-input-container").appendChild(wrapper);
// }

// // save to localstorage 
// function saveToLocalstorage(type, placeholder) {
//     const inputs = JSON.parse(localStorage.getItem('customInputs')) || [];
//     const exists = inputs.some(input => input.type === type && input.placeholder === placeholder);
//     if (!exists) {
//         inputs.push({type, placeholder});
//         localStorage.setItem('customInputs', JSON.stringify(inputs));
//     }
// }

// // Remove from localstorage
// function removeFromLocalStorage(type, placeholder) {
//     let inputs = JSON.parse(localStorage.getItem('customInputs')) || [];
//     inputs = inputs.filter(input => input.type !== type || input.placeholder !== placeholder);
//     localStorage.setItem('customInputs', JSON.stringify(inputs));
// }

window.onload = function () {
    const savedInputs = JSON.parse(localStorage.getItem(`${projectID}-customInputs`)) || [];

    const defaultInput = { type: 'number', placeholder: 'Amount in SAR', name: 'Amount' };
    const hasDefault = savedInputs.some(
        input => input.type === defaultInput.type && input.placeholder === defaultInput.placeholder && input.name === defaultInput.name
    );

    if (!hasDefault) {
        savedInputs.unshift(defaultInput);
        localStorage.setItem(`${projectID}-customInputs`, JSON.stringify(savedInputs));
    }

    savedInputs.forEach(input => {
        createInput(input.type, input.name, input.placeholder);
        createSidebarItem(input.type, input.placeholder, input.name);
    });
};

function addCustomInput() {
    const type = document.getElementById('inputType').value.trim() || 'text';
    const name = document.getElementById('inputName').value.trim() || '';
    const placeholder = document.getElementById('inputPlaceholder').value.trim() || '';

    const exists = checkInputExists(type, name, placeholder);
    if (exists) return;

    saveToLocalStorage(type, name, placeholder);
    createInput(type, name, placeholder);
    createSidebarItem(type, name, placeholder);
}

function checkInputExists(type, name, placeholder) {
    const inputs = JSON.parse(localStorage.getItem(`${projectID}-customInputs`)) || [];
    return inputs.some(input => input.type === type && input.placeholder === placeholder && input.name === name);
}

function saveToLocalStorage(type, name, placeholder) {
    const inputs = JSON.parse(localStorage.getItem(`${projectID}-customInputs`)) || [];
    inputs.push({ type, name, placeholder });
    localStorage.setItem(`${projectID}-customInputs`, JSON.stringify(inputs));
}

function removeFromLocalStorage(type, name, placeholder) {
    let inputs = JSON.parse(localStorage.getItem(`${projectID}-customInputs`)) || [];
    inputs = inputs.filter(input => input.type !== type || input.placeholder !== placeholder || input.name !== name);
    localStorage.setItem(`${projectID}-customInputs`, JSON.stringify(inputs));
}

function createInput(type, name, placeholder) {
    const wrapper = document.createElement('div');
    wrapper.className = 'input-wrapper';

    const input = document.createElement('input');
    input.className = "action-input";
    input.type = type;
    input.name = name;
    input.placeholder = placeholder;
    input.min = '0';
    input.step = '0.01';
    input.required = true;

    
    wrapper.appendChild(input);

    document.getElementById('custom-input-container').appendChild(wrapper);
    
}

const editMapBtn = document.getElementById("editMapButton");
const downloadImageBtn = document.getElementById("downloadImageBtn")

downloadImageBtn?.remove()

editMapBtn.addEventListener("click", (e) => {
    isEditingMap = !isEditingMap

    if(isEditingMap)
        editMapBtn.textContent = "Exit Edit Map Mode"
    else {
        editMapBtn.textContent = "Edit Map"
    }
})

function createSidebarItem(type, name, placeholder) {
    const sidebarList = document.getElementById('sidebarInputList');

    const item = document.createElement('div');
    item.className = 'sidebar-input-item';
    item.dataset.type = type;
    item.dataset.name = name;
    item.dataset.placeholder = placeholder;

    item.innerHTML = `
        <span>${type}: ${placeholder}</span>
        <button onclick="deleteInput('${type}', '${name}', '${placeholder}')">&times;</button>
    `;

    sidebarList.appendChild(item);
}

function deleteInput(type, name, placeholder) {
    // Remove from localStorage
    removeFromLocalStorage(type, name, placeholder);

    // Remove from main input container
    const mainInputs = document.querySelectorAll('#custom-input-container .input-wrapper');
    mainInputs.forEach(wrapper => {
        const input = wrapper.querySelector('input');
        if (input && input.type === type && input.placeholder === placeholder && input.name === name) {
            wrapper.remove();
        }
    });

    // Remove from sidebar
    const sidebarItems = document.querySelectorAll('#sidebarInputList .sidebar-input-item');
    sidebarItems.forEach(item => {
        if (item.dataset.type === type && item.dataset.placeholder === placeholder && item.dataset.name === name) {
            item.remove();
        }
    });
}