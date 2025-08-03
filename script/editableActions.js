const select = document.getElementById('customer-actions-choices');
const input = document.getElementById('option-input');
const STORAGE_KEY = 'dynamic-select-options';

// Load options from localStorage
function loadOptions() {
    const stored = localStorage.getItem(STORAGE_KEY);
    const options = stored ? JSON.parse(stored) : ["Deposit Money", "Withdraw Money", "Transfer Funds", "Pay Bills"];
    select.innerHTML = ''; // Clear existing options
    options.forEach(text => {
        const option = document.createElement('option');
        option.value = text.toLowerCase().replace(/\s+/g, '-'); // Convert to a valid value
        option.text = text;
        select.appendChild(option);
    });
}

// Save options to localStorage
function saveOptions() {
    const options = Array.from(select.options).map(opt => opt.text);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
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

loadOptions();