const nconf = require('nconf');

// Initialize the SendGrid mail engine
// https://app.sendgrid.com/email_activity?
// Use the url to monitor the email activity
// Free account. Allows max of 12k emails/month
const SGMail = require('@sendgrid/mail');
const SENDGRID_SENDER = nconf.get('sendgrid_sender');
SGMail.setApiKey(nconf.get('sendgrid_api_key'));

/**
 * Send an email to the event organizer once
 * the event is created successfully in the
 * database.
 * FIXME: validate email id here
 */
exports.sendEventCreationEmail = function(orgEmail, eventDetails) {

    // dont send mails when there are no details
    if (!orgEmail || ! eventDetails) {
        return 
    }

    const msgContent = '' +
        '<strong>The following CSDS event has been created.</strong></br></br>' +
        '<strong>Event Name: ' + eventDetails.title +'</strong></br>' +
        '<strong>Event ID: ' + eventDetails.eventId +'</strong></br>' +
        '<p>Description: ' + eventDetails.description + '</p>' +
        '<p>Location: ' + eventDetails.location + '</p>' +
        '<p>Organizer: ' + eventDetails.organizername + '</p>' +
        '<p>Start: ' + eventDetails.startdate + '</p>' +
        '<p>End: ' + eventDetails.enddate + '</p>' +
        '<p>Allowed Attendee Count: ' + eventDetails.maxattendees + '</p>';

    const msg = {
        to: orgEmail,
        from: SENDGRID_SENDER,
        subject: 'CSDS Event creation confirmation.',
        html: msgContent
    };

    return SGMail.send(msg);
};