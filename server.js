const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

const mongoose = require('mongoose');

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

 
// Serve HTML file at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
   
});



// Or alternatively use express.static middleware for serving all static files in the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


app.get('/api/subjects', (req, res) => {
  res.json(subjectData);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
