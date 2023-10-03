const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
}, {_id: false}); // _id: false means this sub-document won't have a unique ID

const DaySchema = new Schema({
    day: {
        type: String,
        required: true,
        trim: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] // Ensuring day field has one of these values
    },
    slots: [SlotSchema]
}, {_id: false});

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
    timestamps: true // This will add `createdAt` and `updatedAt` fields
});

module.exports = mongoose.model('Timetable', TimetableSchema);
