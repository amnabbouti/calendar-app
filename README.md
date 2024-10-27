## icalendar Generator

This application allows users to upload a text file containing a schedules, which are then parsed and converted into an iCalendar (.ics) format, users can download the generated .ics file and view a list of previously generated files.

Features\
Upload a text file with course schedules.
Generate an iCalendar (.ics) file from the uploaded schedule.
Download the generated .ics file.
View and delete previously generated .ics files.

Requirements
Node.js (v14 or higher recommended)
NPM (Node Package Manager)

Installation:

Clone the repository:\
bash\
git clone <repository-url>
cd <repository-directory>

Install dependencies:\
bash\
npm install

Run the application:\
bash\
node index.js\
Access the application: Open your browser and go to http://localhost:3000.

File Format\
To upload a schedule, create a text file with the following format:

dd-MM-yyyy HH:mm\
dd-MM-yyyy HH:mm\
event Name

Each event entry consists of:

Start time
End time
Course name

## Example:

01-11-2024 09:00 \
01-11-2024 10:30 \
Mathematics 101

01-11-2024 11:00\
01-11-2024 12:30\
Physics 202

01-11-2024 11:00\
01-11-2024 12:30\
science 203

---

Endpoints:\
POST /upload: Upload a text file with the course schedule.
GET /download/: Download the generated .ics file.
GET /list-files: View the list of generated .ics files.
DELETE /delete-file: Delete a specified .ics file.

Usage:\
Upload a Schedule: Use the provided form to upload your schedule text file.
Download ICS File: After uploading, you will receive a link to download your generated .ics file.
View and Manage Files: Navigate to the list files page to see all generated .ics files, and delete any files you no longer need.

Notes:\
The maximum file size for uploads is set to 2MB.
Ensure that the date format in your text file matches dd-MM-yyyy HH:mm.
Invalid date formats will result in an error during the upload process.
Contributing
Feel free to submit issues or pull requests for improvements or features.

License\
This is free and unencumbered software released into the public domain.
Anyone is free to use, modify, and distribute this software for any purpose, with or without attribution.
