const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let RecurringPatternSchema = new Schema({
    event_id: { type: String, required: true, max: 100 },
    recurring_type: { type: String, required: true, enum: ['daily', 'weekly', 'monthly', 'yearly'] },
    separation_count: { type: Number, default: 0 },
    max_num_occurences: { type: Number, default: 1 },
    day_of_week: { type: Number, min:1, max: 7 },
    week_of_month: { type: Number, min:1, max: 5 },
    day_of_month: { type: Number, min:1, max: 31 },
    month_of_year: { type: Number, min:1, max: 12 }
});

module.exports = mongoose.model('RecurringPattern', RecurringPatternSchema);