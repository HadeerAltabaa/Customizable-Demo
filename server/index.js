import express from "express";
import cors from "cors"
import os from "os";
import XLSX from "xlsx"

const app = express();
app.use(cors())

app.use(express.json({ limit: "20mb" }));

app.post("/upload", (req, res) => {
  const { name, type, data } = req.body;

  try {
    const buffer = Buffer.from(data);

    // Extract graph data from Excel buffer
    // const graphData = extractGraphDataFromExcel(buffer);

    res.json({
      content: `
        <div style="font-family: Arial, sans-serif;">
            <strong>Processed file:</strong> ${name}
            <div style="font-size: 12px; color: gray; margin-top: 4px;">
                (This response was sent via API)
            </div>
        </div>
      `
      // graphData: graphData // send graph data to client
    });

  } catch (err) {
    console.error("Error processing file:", err);
    res.status(400).json({ content: "Failed to process file." });
  }
});

function extractGraphDataFromExcel(buffer) {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json(worksheet);

  if (rows.length === 0) {
    return { labels: [], values: [] };
  }

  const firstRow = rows[0];

  // Find the first string-type key for labels
  let labelKey = null;
  // Find the first number-type key for values
  let valueKey = null;

  for (const key of Object.keys(firstRow)) {
    const val = firstRow[key];
    if (labelKey === null && typeof val === "string") {
      labelKey = key;
    }
    if (valueKey === null && typeof val === "number") {
      valueKey = key;
    }
    if (labelKey && valueKey) break; // Found both keys
  }

  // If either key not found, return empty arrays
  if (!labelKey || !valueKey) {
    console.warn("Could not find suitable label or value columns.");
    return { labels: [], values: [] };
  }

  const labels = [];
  const values = [];

  rows.forEach(row => {
    const label = row[labelKey];
    const value = row[valueKey];
    if (typeof label === "string" && typeof value === "number") {
      labels.push(label);
      values.push(value);
    }
  });

  return { labels, values };
}

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
