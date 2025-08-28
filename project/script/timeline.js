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

let timelineItems = [];

let tracker = {}

function addItemToTimeLine(value1, value2, userid, sectionId) {
    const container = document.getElementById("timelineSection");
    let emoji = "";

    container.style.opacity = 100

    // Prevent duplicates (per user & value2)
    if (timelineItems.some(item => item.value2 === value2 && item.userid === userid)) return;

    
    // Add new item
    timelineItems.push({ value1, value2, userid });

    // Keep only items with the same userid
    let newTimelineItems = timelineItems.filter(item => item.userid === userid);

    // Sort by timestamp
    // timelineItems.sort((a, b) => {
    //     const parseDate = (str) => {
    //         const day = parseInt(str.slice(0, 2), 10);
    //         const monthStr = str.slice(2, 5).toUpperCase();
    //         const year = 2000 + parseInt(str.slice(5, 7), 10);
    //         const [hour, minute, second] = str.split(":").slice(1).map(Number);

    //         const months = {
    //             JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
    //             JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
    //         };

    //         return new Date(year, months[monthStr], day, hour, minute, second);
    //     };

    //     return parseDate(a.timestamp) - parseDate(b.timestamp);
    // });

    // Clear container
    container.innerHTML = "";

    const ICONS = config.timeline.icons

    // if(value1 == "Failure")
    //     tracker[userid] = tracker[userid] != undefined ? tracker[userid] + 1 : 1
    // else if (value1 == "Success")
    //     tracker[userid] = 0

    // if(tracker[userid] >= 3)
    //     createAnOffer(sectionId, userid, "Too many failed attempts")

    // Render timeline items
    newTimelineItems.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "timeline-item";

        // const readableTime = formatDate(item.timestamp);

        emoji = ICONS[item.value1];
        

        div.innerHTML = `
            ${emoji ? `<span class="emoji">${emoji}</span>` : ""}
            <span class="location">${item.value1}</span>
            <span class="timestamp">${item.value2}</span>
        `;

        container.appendChild(div);
    });
}