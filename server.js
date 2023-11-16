const { v4: uuidv4 } = require('uuid');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Serve static files from the 'public' directory
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

// GET request to fetch all notes
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error reading notes' });
        return;
      }
      let notes;
    try {
      notes = JSON.parse(data || '[]'); // If data is empty, parse an empty array as a fallback
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      res.status(500).json({ error: 'Error parsing JSON' });
      return;
    }

    res.json(notes);
  });
});

// GET request to fetch a specific note by ID
app.get('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error reading notes' });
        return;
      }
  
      let notes;
      try {
        notes = JSON.parse(data || '[]'); // If data is empty, parse an empty array as a fallback
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        res.status(500).json({ error: 'Error parsing JSON' });
        return;
      }
  
      const retrievedNote = notes.find((note) => note.id === noteId);
  
      if (retrievedNote) {
        res.json(retrievedNote);
      } else {
        res.status(404).json({ error: 'Note not found' });
      }
    });
  });
  
  // POST request to add a new note
app.post('/api/notes', (req, res) => {
    const newNote = req.body;

    newNote.id = uuidv4(); //Generate uuid
  
    console.log('Received new note:', newNote); // Log the received note to verify
  
    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error reading notes' });
        return;
      }
  
      let notes = JSON.parse(data || '[]'); // Empty array as fallback
  
      notes.push(newNote);
  
      fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Error saving note' });
          return;
        }
        console.log('Note saved successfully:', newNote); // Log a success message
        res.json(newNote);
      });
    });
  });