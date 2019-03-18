// const Utils = require('../utils/utils');
const Mailer = require('../utils/mailer');

const SpecEventRequest = require('../models/evtreg.model');

/**
 * 
 * @param {*} req 
 */
var parseCreateEventRequest = function(req) {
    var eventDetails = {};
    var requestBody = req.body;

    eventDetails.reqname = requestBody.reqname;
    eventDetails.orgname = requestBody.orgname
    eventDetails.reqmail = requestBody.reqmail;
    eventDetails.reqphone = Number(requestBody.reqphone);

    eventDetails.csdsstaffname = requestBody.csdsstaffname;
    eventDetails.csdsstaffmail = requestBody.csdsstaffmail;
    eventDetails.eventtitle = requestBody.eventtitle;
    eventDetails.eventdescription = requestBody.eventdescription;

    eventDetails.spacename = requestBody.spacename;
    eventDetails.max_attendees = Number(requestBody.max_attendees);
    eventDetails.open_ne_community = requestBody.open_ne_community;
    eventDetails.coorg_groups = requestBody.coorg_groups;
    eventDetails.comments = requestBody.comments;

    ['time_one','time_two','time_three','time_four'].forEach(function(t) {
        let d = requestBody[t + '_date'].split('-');
        let s = requestBody[t + '_start'].split(':');
        let e = requestBody[t + '_end'].split(':');

        eventDetails['start_'+ t] = new Date(d[0], d[1], d[2], s[0], s[1]);
        eventDetails['end_'+ t] = new Date(d[0], d[1], d[2], e[0], e[1]);
    }, this);

    eventDetails.request_status = 'pending';

    return eventDetails;
};

/**
 * 
 * @param {*} event_id 
 * @param {*} ifapprove 
 * @param {*} callback 
 */
var approve_reject_Event = function(event_id, ifapprove, callback) {
    if (! event_id || event_id === null || event_id.length === 0){
        return;
    }
    var updateObj;
    if (ifapprove) {
        updateObj = { request_status: 'approved'};
    } else {
        updateObj = { request_status: 'rejected'};
    }
    // executes the query
    SpecEventRequest.findByIdAndUpdate(event_id, updateObj, callback);
};

/**
 * Creates a test form to test the create special event
 * request workflow..
 */
exports.renderSpecialEventRequestForm = function(req, res) {
    return res.render('create_specevent_request');
};

/**
 * FIXME: where is this function used ?
 */
exports.createeventrequest = function(req, res) {
    return res.render('create_specevent_request');
};

/**
 * Once the create special event form is submitted,
 * add the event to the DB with the status 'pending'
 * and email the CSDS contact and the registering person
 * indicating this.
 * After the CSDS contact approves/rejects the request,
 * the DB gets updated with that status.
 */
exports.createspecialeventrequest = function(req, res) {
    if(!req || !req.body) {
        throw new Error("Invalid request object. Failed to create event."); 
    }
    
    let eventDetails = parseCreateEventRequest(req);
    let csdsEventRequest = new SpecEventRequest(eventDetails);

    csdsEventRequest.save(function(err, evtRequest) {
        if (err) {
            return next(err);
        }
        Mailer.sendEvtReqMail_Requestor(evtRequest.reqmail, evtRequest);
        Mailer.sendEvtReqMail_Organizer(evtRequest.csdsstaffmail, evtRequest);
        res.send('New CSDS event request created successfully !!');
    });
};

/**
 * approveReq
 * Called from the email to the CSDS contact to approve
 * an event request.
 */
exports.approveReq = function(req, res) {
    if(!req || !req.body) {
        throw new Error("Invalid request object. Failed to approve event."); 
    }
    approve_reject_Event(req.params.id, true, function(err) {
        if (err) {
            return next(err);
        }
        SpecEventRequest.findById(req.params.id, function (err, eventData) {
            if (err) {
                return next(err);
            }
            Mailer.sendEvtApprovalRejection_Requestor(true, eventData.reqmail, eventData);
            res.status(200).send('CSDS event request was approved !!');
        });
        
    }.bind(this));
};

/**
 * rejectReq
 * Called from the email to the CSDS contact to reject
 * an event request.
 */
exports.rejectReq = function(req, res) {
    if(!req || !req.body) {
    }
    approve_reject_Event(req.params.id, false, function(err) {
        if (err) {
            return next(err);
        }
        SpecEventRequest.findById(req.params.id, function (err, eventData) {
            if (err) {
                return next(err);
            }
            Mailer.sendEvtApprovalRejection_Requestor(false, eventData.reqmail, eventData);
            res.status(200).send('CSDS event was denied and the DB was successfully updated !!');
        });  
    });
};

/**
 * List all approved events as a JSON
 */
exports.listApprovedEvents = function(req, res) {
    if(!req || !req.body) {
        throw new Error("Invalid request object. Failed to get the list of events."); 
    }

    SpecEventRequest.find({
        'request_status': 'approved'
    }, function(err, eventsData) {
        if (err) return next(err);
        res.status(200).send({ events: eventsData});
    });
};

/**
 * CSDS Space Request Form and Contract
 */
exports.renderSpaceEventRequestForm = function(req, res) {
    return res.render('create_event_request');
};

/**
 * Simple test function
 */
exports.test = function (req, res) {
    res.send('Greetings from the Northeastern University ' +
    '- CSDS Events Admin! Powered by Group 6 - 2019');
};
