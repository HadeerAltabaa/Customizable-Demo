// run "npm i" in the terminal to install the packages

import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import xlsx from "xlsx";
import cors from "cors";
import os from "os";

const app = express();
app.use(cors())

// Configure disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const timestamp = Date.now();
    cb(null, `${name}-${timestamp}${ext}`);
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("Try /upload")
})

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const filePath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase();

  try {
    let data;

    if (ext === ".csv") {
      // Read CSV file using xlsx.readFile with 'CSV' type
      const csvWorkbook = xlsx.readFile(filePath, { type: 'string' });
      const csvSheetName = csvWorkbook.SheetNames[0];
      const csvWorksheet = csvWorkbook.Sheets[csvSheetName];
      data = xlsx.utils.sheet_to_json(csvWorksheet);
    } else if (ext === ".xlsx" || ext === ".xls") {
      // Read Excel file
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      data = xlsx.utils.sheet_to_json(worksheet);
    } else {
      // Unsupported file type
      return res.status(400).send("Unsupported file type. Please upload a CSV or Excel file.");
    }

    // Delete file after processing
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
    });

    res.send({
      message: "File processed and deleted successfully.",
      content: "The ESP response will be here when it's implmented"
    });
  } catch (err) {
    console.error("Error reading file:", err);
    res.status(500).send("Failed to parse file.");
  }
});

function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}


const ip = getLocalIPAddress();
const port = 3000;

app.listen(port, () => {
  console.log(`Server running at:`);
  console.log(`- Local:   http://localhost:${port}`);
  console.log(`- Network: http://${ip}:${port}`);
});
