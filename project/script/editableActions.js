const select = document.getElementById('customer-actions-choices');
const input = document.getElementById('option-input');
const optionListContainer = document.getElementById('sidebarOptionList');
const STORAGE_KEY = 'dynamic-select-options';

// Load options from localStorage
function loadOptions() {
    const stored = localStorage.getItem(`${projectID}-${STORAGE_KEY}`);
    const options = stored ? JSON.parse(stored) : ["Deposit Money", "Withdraw Money", "Transfer Funds", "Pay Bills"];
    select.innerHTML = ''; // Clear existing options
    options.forEach(text => {
        const option = document.createElement('option');
        option.value = text.toLowerCase().replace(/\s+/g, '-'); // Convert to a valid value
        option.text = text;
        select.appendChild(option);
    });
    renderOptionList();
}

// Save options to localStorage
function saveOptions() {
    const options = Array.from(select.options).map(opt => opt.text);
    localStorage.setItem(`${projectID}-${STORAGE_KEY}`, JSON.stringify(options));
    renderOptionList();
}

// Add a new option
function addOption() {
    const value = input.value.trim();
    if (value) {
        const option = document.createElement('option');
        option.value = value.toLowerCase().replace(/\s+/g, '-'); // Convert to a valid value
        option.text = value;
        select.add(option);
        input.value = ''; // Clear input
        saveOptions(); // Save changes
    }
}

// Edit the selected option
function editOption() {
    const index = select.selectedIndex;
    const newValue = input.value.trim();
    if (index !== -1 && newValue) {
        select.options[index].text = newValue;
        select.options[index].value = newValue.toLowerCase().replace(/\s+/g, '-'); // Update value
        input.value = ''; // Clear input
        saveOptions(); // Save changes
    }
}

// Delete the selected option
function deleteOption() {
    const index = select.selectedIndex;
    if (index !== -1) {
        select.remove(index);
        saveOptions(); // Save changes
    }
}

function renderOptionList() {
    const options = Array.from(select.options).map(opt => opt.text);
    optionListContainer.innerHTML = ''; // Clear sidebar list

    options.forEach((text, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'sidebar-option-item';
        // onChange="saveEditedOption(${index})"
        wrapper.innerHTML = `
            <input type="text" value="${text}" data-index="${index}" class="sidebar-edit-input">
            <button onclick="saveEditedOption(${index})">&#x2713</button>
            <button onclick="deleteSidebarOption(${index})">&#x1F5D1;</button>
        `;
        optionListContainer.appendChild(wrapper);
    });
}

// ✅ NEW: Save edited option text
function saveEditedOption(index) {
    const inputFields = document.querySelectorAll('.sidebar-edit-input');
    const newValue = inputFields[index].value.trim();
    if (newValue) {
        select.options[index].text = newValue;
        select.options[index].value = newValue.toLowerCase().replace(/\s+/g, '-');
        saveOptions();
    }
}

// ✅ NEW: Delete from sidebar list
function deleteSidebarOption(index) {
    select.remove(index);
    saveOptions();
}

loadOptions();