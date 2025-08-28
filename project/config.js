const config = {
    sendDefualtValues: false, // defualt values: (ex. area, action... )
    timestampFields: ["transaction_datetime"], // Add as a list (ex. ["dateCreated", "dateSent"])
    timeline: {
        isActive: false,
        value1Field: "location", // This is the top text that will be displayed in the timeline
        value2Field: "date", // This is the bottom text that will be displayed in the timeline
        idField: "id", // This is the field id to keep track of the timeline items
        icons: {
            "Pool":"🏊",
            "Villa-304":"🏡",
            "Beach":"🏖️",
            "Spa":"💆",
            "Restaurant":"🍽️",
            "Resturant":"🍽️",
            "Reception":"🛎️",
            "Jetty":"🚤",
            "Stargazing Deck":"🔭",
            "Failure": "❌",
            "Success": "✔️"
        }
    }
}