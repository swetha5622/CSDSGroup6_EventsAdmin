const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CSDSEventSchema = new Schema({
    title: { type: String, required: true, max: 100 },
    description: { type: String },
    location: { type: String, required: true, max: 500},
    startdate: { type: Date, default: Date.now },
    enddate: { type: Date, default: Date.now },
    starttime: { type: Date, default: Date.now },
    endtime: { type: Date, default: Date.now },
    isfulldayevent: { type: Boolean, default: false },
    isrecurring: { type: Boolean, default: false },
    organizername: { type: String, required: true, max: 100 },
    organizeremail: { type: String, required: true },
    maxattendees: { type: Number }
});

// Export the model
// NOTE: The first argument is the singular name of the collection our model is for.
// Mongoose automatically looks for the plural, lowercased version of our model name.
// Thus, for the case below, the model CSDSEvent is for the csdsevents 
// collection in the database.
module.exports = mongoose.model('CSDSEvent', CSDSEventSchema);