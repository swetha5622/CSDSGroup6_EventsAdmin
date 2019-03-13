const Utils = require('../utils/utils');
const Mailer = require('../utils/mailer');

const Event = require('../models/event.model');
const RecurringPattern = require('../models/recurringpattern.model');

/**
 * Simple test function
 */
exports.test = function (req, res) {
    res.send('Greetings from the Northeastern University ' +
    '- CSDS Events Admin! Powered by Group 6 - 2019');
};

/**
 * Create a new event in the DB
 * and send a mail to the organizer
 * on success.
 * 
 * FIXME: Needs validations for the fields.. like
 * start should be less than the end date,
 * check for duplicate event instances etc
 */
exports.createNewEvent = function(req, res) {

    if(!req || !req.body) {
        throw new Error("Invalid request object. Failed to create event."); 
    }

    var requestBody = req.body;
    var eventDetails = {};

    eventDetails.title = req.body.title;
    eventDetails.description = req.body.description;
    eventDetails.location = req.body.location;
    eventDetails.organizername = req.body.organizername;

    if(Utils.isValidEmail(req.body.organizeremail))
        eventDetails.organizeremail = req.body.organizeremail;
    else
        throw new Error("Invalid organizer email id.");

    if (req.body.maxattendees)
        eventDetails.maxattendees = Number(req.body.maxattendees);

    if (req.body.isrecurring === 'on')
        eventDetails.isrecurring = true;
    else
        eventDetails.isrecurring = false;
    
    if (req.body.isfulldayevent === 'on')
        eventDetails.isfulldayevent = true;
    else
        eventDetails.isfulldayevent = false;
    
    if (req.body.startdate)
        eventDetails.startdate = eventDetails.starttime = new Date(req.body.startdate);
    if (req.body.enddate)
        eventDetails.enddate = eventDetails.endtime = new Date(req.body.enddate);

    let csdsEvent = new Event(eventDetails);
    
    csdsEvent.save(function(err, newEvent) {
        if (err) {
            return next(err);
        }

        var eventId = newEvent.id || newEvent._id;

        // Send a mail to the organizer indicating the success.
        eventDetails.eventId = eventId;
        Mailer.sendEventCreationEmail(eventDetails.organizeremail, eventDetails);

        if (eventDetails.isrecurring === true) {
            // Store the event recurrence pattern
            var recurrenceDetails = {};

            recurrenceDetails.event_id = eventId;
            recurrenceDetails.recurring_type = requestBody.recurring_type;

            if(requestBody.max_num_occurences)
            recurrenceDetails.max_num_occurences = Number(requestBody.max_num_occurences);

            if(requestBody.separation_count)
                recurrenceDetails.separation_count = Number(requestBody.separation_count);
            
            if(requestBody.day_of_week)
                recurrenceDetails.day_of_week = Number(requestBody.day_of_week);
            
            if(requestBody.week_of_month)
                recurrenceDetails.week_of_month = Number(requestBody.week_of_month);
            
            if(requestBody.day_of_month)
                recurrenceDetails.day_of_month = Number(requestBody.day_of_month);
            
            if(requestBody.month_of_year)
                recurrenceDetails.month_of_year = Number(requestBody.month_of_year);

            let recPattern = new RecurringPattern(recurrenceDetails);
            recPattern.save(function(err) {
                if (err) {
                    return next(err);
                }
                res.send('New recurring CSDS event created successfully !!');
            });
        }
        else {
            res.send('New CSDS event created successfully !!');
        }
    });
};

/**
 * Render the CreateEvent form
 */
exports.renderCreateEventForm = function(req, res) {
    return res.render('create_event');
};