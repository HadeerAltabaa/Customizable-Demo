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
    const savedInputs = JSON.parse(localStorage.getItem('customInputs')) || [];

    const defaultInput = { type: 'number', placeholder: 'Amount in SAR' };
    const hasDefault = savedInputs.some(
        input => input.type === defaultInput.type && input.placeholder === defaultInput.placeholder
    );

    if (!hasDefault) {
        savedInputs.unshift(defaultInput);
        localStorage.setItem('customInputs', JSON.stringify(savedInputs));
    }

    savedInputs.forEach(input => {
        createMainInput(input.type, input.placeholder);
        createSidebarItem(input.type, input.placeholder);
    });
};

function addCustomInput() {
    const type = document.getElementById('inputType').value.trim() || 'text';
    const placeholder = document.getElementById('inputPlaceholder').value.trim() || '';

    const exists = checkInputExists(type, placeholder);
    if (exists) return;

    saveToLocalStorage(type, placeholder);
    createMainInput(type, placeholder);
    createSidebarItem(type, placeholder);
}

function checkInputExists(type, placeholder) {
    const inputs = JSON.parse(localStorage.getItem('customInputs')) || [];
    return inputs.some(input => input.type === type && input.placeholder === placeholder);
}

function saveToLocalStorage(type, placeholder) {
    const inputs = JSON.parse(localStorage.getItem('customInputs')) || [];
    inputs.push({ type, placeholder });
    localStorage.setItem('customInputs', JSON.stringify(inputs));
}

function removeFromLocalStorage(type, placeholder) {
    let inputs = JSON.parse(localStorage.getItem('customInputs')) || [];
    inputs = inputs.filter(input => input.type !== type || input.placeholder !== placeholder);
    localStorage.setItem('customInputs', JSON.stringify(inputs));
}

function createMainInput(type, placeholder) {
    const wrapper = document.createElement('div');
    wrapper.className = 'input-wrapper';

    const input = document.createElement('input');
    input.className = "action-input";
    input.type = type;
    input.placeholder = placeholder;
    input.min = '0';
    input.step = '0.01';
    input.required = true;

    const applyBtn = document.createElement('button');
    applyBtn.textContent = 'Apply';
    applyBtn.type = 'button';
    applyBtn.id = 'actionApplyButton'

    wrapper.appendChild(input);

    document.getElementById('custom-input-container').appendChild(wrapper);
    document.getElementById('actionApplyButton')?.remove()

    document.getElementById('custom-input-container').appendChild(applyBtn);
}

function createSidebarItem(type, placeholder) {
    const sidebarList = document.getElementById('sidebarInputList');

    const item = document.createElement('div');
    item.className = 'sidebar-input-item';
    item.dataset.type = type;
    item.dataset.placeholder = placeholder;

    item.innerHTML = `
        <span>${type}: ${placeholder}</span>
        <button onclick="deleteInput('${type}', '${placeholder}')">&times;</button>
    `;

    sidebarList.appendChild(item);
}

function deleteInput(type, placeholder) {
    // Remove from localStorage
    removeFromLocalStorage(type, placeholder);

    // Remove from main input container
    const mainInputs = document.querySelectorAll('#custom-input-container .input-wrapper');
    mainInputs.forEach(wrapper => {
        const input = wrapper.querySelector('input');
        if (input && input.type === type && input.placeholder === placeholder) {
            wrapper.remove();
        }
    });

    // Remove from sidebar
    const sidebarItems = document.querySelectorAll('#sidebarInputList .sidebar-input-item');
    sidebarItems.forEach(item => {
        if (item.dataset.type === type && item.dataset.placeholder === placeholder) {
            item.remove();
        }
    });
}