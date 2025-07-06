const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Set headers
  res.setHeader("Content-Type", "text/plain");

  // Route: Create File
  if (pathname === "/create" && req.method === "GET") {
    const { filename, content } = query;
    if (!filename || !content) {
      res.end("❌ Please provide both filename and content in query.");
      return;
    }

    const filePath = path.join(__dirname, filename);
    fs.writeFile(filePath, content, (err) => {
      if (err) return res.end("❌ Error creating file: " + err.message);
      res.end(`✅ File '${filename}' created successfully.`);
    });
  }

  // Route: Read File
  else if (pathname === "/read" && req.method === "GET") {
    const { filename } = query;
    if (!filename) {
      res.end("❌ Please provide filename to read.");
      return;
    }

    const filePath = path.join(__dirname, filename);
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) return res.end("❌ Error reading file: " + err.message);
      res.end(`📄 Contents of '${filename}':\n\n${data}`);
    });
  }

  // Route: Delete File
  else if (pathname === "/delete" && req.method === "GET") {
    const { filename } = query;
    if (!filename) {
      res.end("❌ Please provide filename to delete.");
      return;
    }

    const filePath = path.join(__dirname, filename);
    fs.unlink(filePath, (err) => {
      if (err) return res.end("❌ Error deleting file: " + err.message);
      res.end(`🗑️ File '${filename}' deleted successfully.`);
    });
  }

  // Default route
  else {
    res.end("📂 Welcome to Node.js File Manager!\nUse /create, /read, or /delete with ?filename=yourfile");
  }
});

server.listen(PORT, () => {
  console.log(`🚀 File Manager running at http://localhost:${PORT}`);
});
