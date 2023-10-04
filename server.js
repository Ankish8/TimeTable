const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const mongoose = require('mongoose');

const apiRouter = require('./routes/api'); // Updated path here

mongoose.connect('mongodb://localhost/timetable', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

const subjectData = {
  'Technology in Experience Design Advance': 'Deepali Gour',
  'Visual Design Tools Advance': 'Radhika',
  'UX & Digitalization': 'Keerthana',
  'Usability Testing': 'Ankish',
  'Innovation Management': 'Bhawana Jain',
}; 

app.use(express.json());
app.use('/api', apiRouter); // This line mounts your API router on the '/api' path

/* app.post('/remove-all', (req, res) => {
  // You need to replace the collection name 'yourCollection' with the actual name of your collection.
  db.collection('timetable').deleteMany({}, (err, result) => {
      if (err) {
          console.error('Error removing data:', err);
          res.status(500).json({ success: false, message: 'Internal Sessrver Error', error: err.message });
          return;
      }
      res.json({ success: true });
  });
}); */


 
// Serve HTML file at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
   
});

app.get('/api/subject-data', (req, res) => {
  res.json(subjectData);
});

// Or alternatively use express.static middleware for serving all static files in the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


app.get('/api/subjects', (req, res) => {
  res.json(subjectData);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
 