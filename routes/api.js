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
        const timetable = new Timetable(req.body);
        await timetable.save();
        res.json({ success: 'Data added successfully' });
    } catch (error) {
        res.json({ error: 'Error adding data' });
    }
});

// ...and so on for updating and deleting data

// ... add more routes to create, update, delete timetables

module.exports = router;
