
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Define a route for the '/notes' endpoint
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Example to read db.json
app.get('/readnotes', (req, res) => {
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading db.json');
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Example to write to db.json
app.post('/savenote', (req, res) => {
  const newNote = req.body; // Assuming data is sent in the request body

  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading db.json');
      return;
    }

    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile('db.json', JSON.stringify(notes), 'utf8', (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error writing to db.json');
        return;
      }
      res.send('Note saved successfully');
    });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});