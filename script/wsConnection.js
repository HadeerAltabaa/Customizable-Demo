const waitlist = {}

const ws = new WebSocket("ws://localhost:8080");

ws.onmessage = (event) => {
    let data = JSON.parse(event.data)
    if(data.id in waitlist) {
        document.querySelector(`#previewID-${waitlist[data.id].elementId}`).innerHTML = JSON.stringify(data, null, 4);
        delete waitlist[data.id]

    }
};

function addUserToWSWaitlist(elementId, userId) {
    // Add this person's ID to the waitlist
    waitlist[userId] = {
        userId,
        elementId
    }
}
