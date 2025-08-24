const waitlist = {}

const ws = new WebSocket("ws://localhost:8080");

ws.onmessage = (event) => {
    let content = JSON.parse(event.data)
    content.data = JSON.parse(content.data)

    if(waitlist[content.data.id]) {
        document.getElementById(content.data.id).innerText = content.message
        delete waitlist[content.data.id]
    }
};

function addUserToWSWaitlist(elementId, userId) {
    // Add this person's ID to the waitlist
    waitlist[userId] = {
        userId,
        elementId
    }
}