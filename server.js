const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Set up routes to serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// Start the server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);