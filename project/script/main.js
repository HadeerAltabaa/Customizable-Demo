let mouseX = 0;
let mouseY = 0;
let area = 0;
let selectedFile = null;
let isEditingMap = false
let mockBoxes = {}

let mockDataDefualtInputs = [
    {
        name: "id",
        placeholder: "User ID"
    },
    {
        name: "name",
        placeholder: "Name"
    },
    {
        name: "area",
        placeholder: "Area"
    },
    {
        name: "action",
        placeholder: "Action Type"
    },
    {
        name: "actionData",
        placeholder: "Action Data { json }"
    },
    {
        name: "segment",
        placeholder: "Segment"
    }
]

const projectID = localStorage.getItem("currentProject")

if(!projectID) window.location = `${window.location.protocol}//${window.location.host}/`

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
})
