/* const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const port = 3000;
const apiRouter = require('./routes/api'); 

mongoose.connect('mongodb://localhost/timetable', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// This data can be replaced with a database call if it needs to be dynamic
const subjectData = {
  'Technology in Experience Design Advance': 'Deepali Gour',
  'Visual Design Tools Advance': 'Radhika',
  'UX & Digitalization': 'Keerthana',
  'Usability Testing': 'Ankish',
  'Innovation Management': 'Bhawana Jain',
}; 

// Middleware to parse JSON data
app.use(express.json());

// Mount API router
app.use('/api', apiRouter);

// Endpoint to provide data for the dropdown
app.get('/api/subject-data', (req, res) => {
  res.json(subjectData);
});

// Serve HTML file at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware for serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
 */


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
 