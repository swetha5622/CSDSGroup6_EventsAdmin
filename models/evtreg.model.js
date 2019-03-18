const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let EventRegSchema = new Schema ({
    reqname: { type: String, required: true, max: 500 },
    orgname: { type: String, required: true, max: 500 },
    reqmail: { type: String, required: true, max: 500 },
    reqphone: { type: Number, required: true },

    csdsstaffname: { type: String, required: true, max: 500 },
    csdsstaffmail: { type: String, required: true, max: 500 },

    eventtitle: { type: String, required: true, max: 500 },
    eventdescription: { type: String, required: true, max: 1000 },

    start_time_one: { type: Date, default: Date.now, required: true },
    start_time_two: { type: Date, default: Date.now, required: true },
    start_time_three: { type: Date, default: Date.now, required: true },
    start_time_four: { type: Date, default: Date.now, required: true },

    end_time_one: { type: Date, default: Date.now, required: true },
    end_time_two: { type: Date, default: Date.now, required: true },
    end_time_three: { type: Date, default: Date.now, required: true },
    end_time_four: { type: Date, default: Date.now, required: true },

    spacename: { type: String, required: true, enum: ['sacred_space', 'reflection_room', 'office_lounge'] },
    max_attendees: { type: Number, required: true, min:1, max:500 },
    open_ne_community: { type: String, required: true, enum: ['yes', 'no', 'other'] },
    coorg_groups: { type: String, required: true, max: 1000 },
    comments: { type: String, required: true, max: 1000 },

    request_status: { type: String, required: true, enum: ['approved', 'rejected', 'pending'] }
});

// Export the model
// NOTE: The first argument is the singular name of the collection our model is for.
// Mongoose automatically looks for the plural, lowercased version of our model name.
// Thus, for the case below, the model CSDSEventReg is for the csdseventregs
// collection in the database.
module.exports = mongoose.model('CSDSEventReg', EventRegSchema);