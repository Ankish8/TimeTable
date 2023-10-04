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
  try {
      const existingTimetable = await Timetable.findOne({ week: req.body.week, batch: req.body.batch });
      if (existingTimetable) {
          // update existing timetable
          existingTimetable.days = req.body.days;
          await existingTimetable.save();
      } else {
          // or create new timetable
          const timetable = new Timetable(req.body);
          await timetable.save();
      }
      res.json({ success: 'Data saved successfully' });
  } catch (error) {
      console.error('Error saving data:', error);
      res.json({ error: 'Error saving data' });
  }
});



router.post('/update-slot', async (req, res) => {
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

