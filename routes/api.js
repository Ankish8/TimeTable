const express = require('express');
const Timetable = require('../models/Timetable');
 
const router = express.Router();

// Set up your API routes here

// Example: Get all timetables
// Get timetable data for a specific week and batch
router.get('/timetable', async (req, res) => {
    const { week, batch } = req.query;
    try {
        const timetable = await Timetable.findOne({ week, batch });
        res.json(timetable);
    } catch (error) {
        res.json({ error: 'Error fetching data' });
    }
}); 

// Add new timetable data
router.post('/timetable', async (req, res) => {
  console.log('Request Body:', req.body); // Log the entire request body
  try {
      const timetable = new Timetable(req.body);
      const savedTimetable = await timetable.save();
      res.json({ success: 'Data added successfully', data: savedTimetable });
  } catch (error) {
      console.error('Error adding data:', error); // Log detailed error information
      res.status(500).json({ error: 'Error adding data', errorMessage: error.message, errors: error.errors });
  }
});




/* router.post('/timetable', async (req, res) => {
    try {
        const timetable = new Timetable(req.body);
        const savedTimetable = await timetable.save();
        console.log('Saved Timetable:', savedTimetable); // Log saved data
        res.json({ success: 'Data added successfully' });
    } catch (error) {
        console.error('Error adding data:', error); // Log error message
        res.json({ error: 'Error adding data' });
    }
}); */


router.post('/update-slot', async (req, res) => {
  console.log(req.body); // Log the received data here

    const { week, batch, day, time, subject, faculty } = req.body;
  
    try {
      // Find the correct timetable
      const timetable = await Timetable.findOne({ week, batch });
      
      if (!timetable) {
        return res.status(404).json({ error: 'Timetable not found' });
      }
  
      // Find the correct day and time slot to update
      const dayToUpdate = timetable.days.find(d => d.day === day);
  
      if (!dayToUpdate) {
        return res.status(404).json({ error: 'Day not found' });
      }
  
      const slotToUpdate = dayToUpdate.slots.find(s => s.time === time);
  
      if (!slotToUpdate) {
        return res.status(404).json({ error: 'Time slot not found' });
      }
  
      // Update the slot with new subject and faculty
      slotToUpdate.subject = subject;
      slotToUpdate.faculty = faculty;
  
      // Save the updated timetable
      await timetable.save();
      res.json({ success: 'Slot updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  

// ...and so on for updating and deleting data

// ... add more routes to create, update, delete timetables

module.exports = router;

