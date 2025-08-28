export default {
    PORT: 8080,
    mqtt: {
        // Enter the mqtt server here
        server: "mqtt://10.225.14.54:1883",
        // This is the topic that the esp will subscribe to ( the server will send the data to it )
        espTopic: "sas-demo/esp",
        // This is the topic that the esp send the data back to ( the server will redirect it to the frontend )
        webTopic: "sas-demo/web",
        // Change this to the field that will be sent from esp that contains the message that will be displayed in the frontend
        // if it's undefined an error will display insted of the message
        messageField: "message"
    }
}