const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let AttendeeSchema = new Schema({
    event_id: { type: String, required: true },
    event_date: { type: Date, required: true }, // event start date
    firstname: { type: String, required: true, max: 100 },
    middlename: { type: String, max: 100 },
    lastname: { type: String, required: true, max: 100 },
    gender: { type: String, required: true, enum: ['male', 'female', 'n/a'] },
    email: { type: String, required: true, max: 100 }
});

module.exports = mongoose.model('CSDSAttendee', AttendeeSchema);