const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define the data schema
const TimetableSchema = new Schema({
    week: String,
    batch: String,
    days: [{
        day: String,
        slots: [{
            time: String,
            subject: String,
            faculty: String
        }]
    }]
});

// Create and export the model
module.exports = mongoose.model('Timetable', TimetableSchema);
