import express from "express"
import mqtt from "mqtt"
import cors from "cors";
import config from "./config.js"
import { WebSocketServer } from 'ws';

// Create WebSocket server on the same HTTP server as Express
const wss = new WebSocketServer({ noServer: true });

const app = express()

const mClient = mqtt.connect(config.mqtt.server)

// Handle error event
mClient.on('error', (err) => {
  console.error('Connection error:', err);
});

mClient.subscribe(config.mqtt.espTopic, (err) => {
    if (err) {
        console.error("Failed to subscribe:", err);
    }
});

mClient.subscribe(config.mqtt.webTopic, (err) => {
    if (err) {
        console.error("Failed to subscribe:", err);
    }
});

app.get("/", (req, res) => {
    res.send({
        
    })
})

app.use(express.json())
app.use(cors());

app.post("/send", (req, res) => {   
    try {
        let data = req.body || {}

        mClient.publish(config.mqtt.espTopic, JSON.stringify(data), (err) => {
            if (err) {
                console.log(err)
                res.sendStatus(400)
            } else {
                res.send({
                    message: "Waiting for ID to respond...",
                    data
                })
            }
        });

    } catch (error) {
        console.log(error)
        res.sendStatus(400, error)
    }
})

// ---------------------
// SAS SERVER MOCKUP
mClient.on("message", (topic, message) => {
    if (topic === config.mqtt.webTopic) {
        const data = JSON.parse(message.toString())[0][0];

        broadcast(data);
    }
});

const server = app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`)
})

server.on('upgrade', (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req)
    })
})

function broadcast(data) {
    wss.clients.forEach(client => {
        client.send(JSON.stringify({ message: data[config.mqtt.messageField] != undefined ? data[config.mqtt.messageField] : `${config.mqtt.messageField} does not exsist. check the server logs for details`, data: JSON.stringify(data) }));
        if(data[config.mqtt.messageField] == undefined) {
            console.log(`${config.mqtt.messageField} does not exsist on the data being sent from esp.`)
            console.log("Data being sent from esp:")
            console.log(data)
        }
    });
}