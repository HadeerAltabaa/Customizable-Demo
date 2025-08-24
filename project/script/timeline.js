function formatDate(input) {
    // Extract parts
    const day = parseInt(input.slice(0, 2), 10);
    const monthStr = input.slice(2, 5).toUpperCase();
    const year = 2000 + parseInt(input.slice(5, 7), 10); // assumes 20xx
    const timeStr = input.split(":").slice(1).join(":"); // "18:00:00"

    // Month mapping
    const months = {
        JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
        JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
    };

    const month = months[monthStr];

    // Build Date object
    const [hour, minute, second] = timeStr.split(":").map(Number);
    const date = new Date(year, month, day, hour, minute, second);

    // Format into desired string
    return date.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });
}

let timelineItems = []; // Changed from {} to []

function addItemToTimeLine(location, timestamp) {
    const container = document.getElementById("timelineSection");
    let emoji = "";

    // Prevent duplicates
    if (timelineItems.some(item => item.timestamp === timestamp)) return;

    // Add new item
    timelineItems.push({ location, timestamp });

    // Sort by timestamp
    timelineItems.sort((a, b) => {
        const parseDate = (str) => {
            const day = parseInt(str.slice(0, 2), 10);
            const monthStr = str.slice(2, 5).toUpperCase();
            const year = 2000 + parseInt(str.slice(5, 7), 10);
            const [hour, minute, second] = str.split(":").slice(1).map(Number);

            const months = {
                JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
                JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
            };

            return new Date(year, months[monthStr], day, hour, minute, second);
        };

        return parseDate(a.timestamp) - parseDate(b.timestamp);
    });

    // Clear container
    container.innerHTML = "";

    const ICONS = {
        "Pool":"🏊","Villa-304":"🏡","Beach":"🏖","Spa":"💆",
        "Restaurant":"🍽️","Resturant":"🍽️","Reception":"🛎️",
        "Jetty":"🚤","Stargazing Deck":"🔭"
    };

    // Render timeline items
    timelineItems.forEach(item => {
        const div = document.createElement("div");
        div.className = "timeline-item";

        const readableTime = formatDate(item.timestamp); // You can keep your previous formatDate function

        emoji = ICONS[item.location];

        div.innerHTML = `
            ${emoji ? `<span class="emoji">${emoji}</span>` : ""}
            <span class="location">${item.location}</span>
            <span class="timestamp">${readableTime}</span>
        `;

        container.appendChild(div);
    });
}

addItemToTimeLine("Pool", "04JUL25:18:00:00");
addItemToTimeLine("Villa-304", "05JUL25:10:45:00");
addItemToTimeLine("Beach", "06JUL25:12:30:00");