# Customizable Web Demo

This project is a customizable web demo consisting of a **frontend**, **backend server**, and an **MQTT broker (Mosquitto)**.  
It is designed to run locally with Node.js and integrates with an ESP device via MQTT.

---

## 📂 Project Structure

```

(repo)/
├─ project/        # Frontend (accessed via localhost)
├─ server/         # Backend server
├─ mosquitto/      # Mosquitto MQTT broker (must be installed here)
├─ init.bat        # Installs required dependencies
├─ startMQTT.bat   # Starts the MQTT broker
├─ start.bat       # Starts backend + frontend servers

```

---

## ⚙️ Installation & Setup

1. **Install Mosquitto**  
Download and install from [https://mosquitto.org/](https://mosquitto.org/).  
> ⚠️ The Mosquitto installation folder must be placed inside the repository alongside `server/` and `project/`:  
```

(repo)/server
(repo)/project
(repo)/mosquitto

````

2. **Install Node.js**  
Download and install from [https://nodejs.org/](https://nodejs.org/).  
> Use the **default installation path**.

3. **Install Dependencies** Run:
```bash
init.bat
````

This will install all required npm packages for both the server and frontend.

4. **Start the MQTT Broker** Run:

```bash
startMQTT.bat
```

5. **Configure the Server** Open:

```
server/config.js
```

Update the `server` to point to the **race image** you are connecting to.

6. **Start the Backend & Frontend**
Run:

```bash
start.bat
```

   > The frontend must be accessed from **[http://127.0.0.1](http://127.0.0.1)** (or `localhost`)
   > Do **not** open it directly from the file path.

---

## 🔌 ESP Setup

When configuring the ESP:

1. Update the **MQTT connector’s IP address** to match your local setup.
2. Add the fields that will be sent from the frontend to the source window.

   > You can confirm what fields are being sent by checking the **browser console** after sending a single test row from the frontend.

---

## ✅ Quick Summary

* Install **Mosquitto** inside `(repo)/mosquitto/`
* Install **Node.js** (default path)
* Run `init.bat` → install dependencies
* Run `startMQTT.bat` → start MQTT broker
* Update `server/config.js` → set correct IP\:port
* Run `start.bat` → launch server + frontend (open via `localhost`)
* Configure ESP → set MQTT IP + required fields

---