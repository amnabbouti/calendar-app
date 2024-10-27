const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const ical = require("ical-generator").default;
const { parse, isValid } = require("date-fns");

// Setting up directories for uploads
const uploadsDir = path.join(__dirname, "uploads");
const generatedDir = path.join(uploadsDir, "generated");

// Creating directories if they don't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(generatedDir)) {
  fs.mkdirSync(generatedDir);
}

// Initializing the Express app
const app = express();
const upload = multer({
  dest: uploadsDir,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});

//parsing JSON requests
app.use(express.static("public"));
app.use(express.json());

//parsing the schedule
function parseSchedule(data) {
  const lines = data.split("\n").filter((line) => line.trim() !== "");
  const schedule = [];
  for (let i = 0; i < lines.length; i += 3) {
    if (lines[i + 2]) {
      schedule.push({
        start: lines[i].trim(),
        end: lines[i + 1].trim(),
        course: lines[i + 2].trim(),
      });
    }
  }
  return schedule;
}

// creating the icalendar
function createICalendar(schedule) {
  const calendar = ical({ name: "Course Schedule" });
  const dateFormat = "dd-MM-yyyy HH:mm";

  schedule.forEach(({ start, end, course }) => {
    const startTime = parse(start, dateFormat, new Date());
    const endTime = parse(end, dateFormat, new Date());

    if (!isValid(startTime) || !isValid(endTime)) {
      throw new Error(`Invalid date for course: ${course}`);
    }

    calendar.createEvent({ start: startTime, end: endTime, summary: course });
  });

  return calendar;
}

// Route to upload files
app.post("/upload", upload.single("scheduleFile"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");

  const filePath = req.file.path;
  const icsFileName = `schedule_${Date.now()}.ics`;
  const icsFilePath = path.join(generatedDir, icsFileName);

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) return res.status(500).send("Error reading file.");

    let schedule;
    try {
      schedule = parseSchedule(data);
    } catch (error) {
      return res.status(400).send("Error parsing schedule: " + error.message);
    }

    let calendar;
    try {
      calendar = createICalendar(schedule);
    } catch (error) {
      return res.status(400).send(error.message);
    }

    fs.writeFile(icsFilePath, calendar.toString(), "utf-8", (err) => {
      if (err) return res.status(500).send("Error writing ICS file.");
      res.send(
        `<a href="/download/${icsFileName}" download="${icsFileName}">Download ICS</a>`
      );
    });
  });
});

// Route to list files
app.get("/list-files-data", (req, res) => {
  fs.readdir(generatedDir, (err, files) => {
    if (err) {
      console.error("Error listing files:", err);
      return res.status(500).send("Error listing files.");
    }
    res.json(files);
  });
});

// Route to delete files
app.delete("/delete-file", (req, res) => {
  const fileName = req.query.fileName;
  if (!fileName) return res.status(400).send("No file specified.");

  const filePath = path.join(generatedDir, fileName);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return res.status(500).send("Error deleting file.");
    }
    res.send("File deleted successfully.");
  });
});

// Middleware for error handling
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).send("Internal Server Error");
});

// files for download
app.use("/download", express.static(generatedDir));

// starting the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
