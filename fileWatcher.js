const fs = require("fs");
const path = require("path");
const folderToWatch = "folder";
const logFile = "file_changes.log";

function logChange(changeType, filePath) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${changeType}: ${filePath}\n`;
  console.log(logMessage.trim());
  fs.appendFile(logFile, logMessage, (err) => {
    if (err) console.error("Error writing to log file:", err);
  });
}

fs.watch(folderToWatch, { recursive: true }, (eventType, filename) => {
  if (filename) {
    const filePath = path.join(folderToWatch, filename);
    switch (eventType) {
      case "rename":
        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (err) {
            logChange("File deleted", filePath);
          } else {
            logChange("File created", filePath);
          }
        });
        break;
      case "change":
        logChange("File modified", filePath);
        break;
      default:
        logChange("Unknown change", filePath);
    }
  }
});

console.log(`Monitoring changes in: ${folderToWatch}`);
