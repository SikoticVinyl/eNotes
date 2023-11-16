const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.use('/assets', express.static(path.join(__dirname, 'public', 'assets'), { 
    fallthrough: false,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      }
    }
  }));

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

  app.post('/api/notes', (req, res) => {
    // Read existing notes from db.json file
    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error reading notes' });
        return;
      }
  
      let notes = JSON.parse(data);
      const newNote = req.body;
      newNote.id = generateUniqueID(); // Function to generate a unique ID
  
      notes.push(newNote); // Add the new note to the notes array
  
      // Write updated notes back to db.json file
      fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Error saving note' });
          return;
        }
        res.json(notes); // Respond with the updated array of notes
      });
    });
  });