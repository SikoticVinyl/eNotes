const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Set up routes to serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, `/public/assets/index.html`));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/assets/notes.html'));
});

// Start the server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

const notes = [];

// GET request to fetch all notes
app.get('/api/notes', (req, res) => {
    // Read notes from db.json file
    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error reading notes' });
        return;
      }
      // Parse the JSON data from db.json
      const notes = JSON.parse(data);
      res.json(notes); // Send the array of notes as JSON
    });
  });