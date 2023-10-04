const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define schema for each time slot
const SlotSchema = new Schema({
    time: {
        type: String,
        required: true,
        trim: true
    },
    subject: { 
        type: String,
        trim: true
    },
    faculty: {
        type: String,
        trim: true
    }
}, {_id: false}); // Preventing MongoDB from creating an _id field for sub-document

// Define schema for each day with an array of slots
const DaySchema = new Schema({
    day: {
        type: String,
        required: true,
        trim: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] // Restricting values to weekdays
    },
    slots: [SlotSchema]
}, {_id: false}); // Preventing MongoDB from creating an _id field for sub-document

// Define main timetable schema with an array of days
const TimetableSchema = new Schema({
    week: {
        type: String,
        required: true,
        trim: true
    },
    batch: {
        type: String,
        required: true,
        trim: true
    },
    days: [DaySchema]
}, {
    timestamps: true // Automatically generating createdAt and updatedAt fields
});

// Exporting the model based on the schema to be used in other parts of the application
module.exports = mongoose.model('Timetable', TimetableSchema);
