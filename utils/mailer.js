const nconf = require('nconf');

// Initialize the SendGrid mail engine
// https://app.sendgrid.com/email_activity?
// Use the url to monitor the email activity
// Free account. Allows max of 12k emails/month
const SGMail = require('@sendgrid/mail');
const SENDGRID_SENDER = nconf.get('sendgrid_sender');
SGMail.setApiKey(nconf.get('sendgrid_api_key'));

/**
 * Send an email to the CSDS contact once
 * the event is created successfully in the
 * database. This email will provide the 
 * option to approve/reject the event.
 * FIXME: validate email id here
 */
exports.sendEvtReqMail_Organizer = function(csdsstaffmail, eventDetails) {
    // dont send mails when there are no details
    if (!csdsstaffmail || ! eventDetails) {
        return 
    }

    // Build the url string from the keys.json file
    let urlPrefix = nconf.get('gcp_protocol') + '://' + nconf.get('gcp_domain');
    urlPrefix += ((nconf.get('gcp_port') && nconf.get('gcp_port').length>0) ?
        (':' + nconf.get('gcp_port')) : '');
    urlPrefix += nconf.get('base_route');

    const msg = {
        to: csdsstaffmail,
        from: SENDGRID_SENDER,
        subject: 'New Event Creation Request',
        template_id: 'd-51df8bf239db4283a47a5ec427d9fe62',
        dynamic_template_data: {
            "reqname":eventDetails.reqname,
            "orgname":eventDetails.orgname,
            "reqmail":eventDetails.reqmail,
            "reqphone":eventDetails.reqphone,
            "csdsstaffname":eventDetails.csdsstaffname,
            "csdsstaffmail":eventDetails.csdsstaffmail,
            "eventtitle":eventDetails.eventtitle,
            "eventdescription":eventDetails.eventdescription,
            "start_time_one":eventDetails.start_time_one,
            "start_time_two":eventDetails.start_time_two,
            "start_time_three":eventDetails.start_time_three,
            "start_time_four":eventDetails.start_time_four,
            "end_time_one":eventDetails.end_time_one,
            "end_time_two":eventDetails.end_time_two,
            "end_time_three":eventDetails.end_time_three,
            "end_time_four":eventDetails.end_time_four,
            "spacename":eventDetails.spacename,
            "max_attendees":eventDetails.max_attendees,
            "open_ne_community":eventDetails.open_ne_community,
            "coorg_groups":eventDetails.coorg_groups,
            "comments":eventDetails.comments,
            "submit_url": urlPrefix + '/' + eventDetails.id + '/approvereq',
            "reject_url": urlPrefix + '/' + eventDetails.id + '/rejectreq',
        }
    };

    return SGMail.send(msg);
};

/**
 * 
 */
exports.sendEvtReqMail_Requestor = function(reqEmail, eventDetails) {

    // dont send mails when there are no details
    if (!reqEmail || ! eventDetails) {
        return 
    }

    const msgContent = '' +
        '<strong>The following CSDS event request has been sent to the administrator.</strong></br>'+
        '<strong>You will receive an email once the administrator accepts/denies the request.</strong></br></br>' +
        '<strong>Event Name: ' + eventDetails.eventtitle +'</strong></br>' +
        '<strong>Event ID: ' + eventDetails._id +'</strong></br>' +
        '<p>Description: ' + eventDetails.eventdescription + '</p>' +
        '<p>Location: ' + eventDetails.spacename + '</p>';

    const msg = {
        to: reqEmail,
        from: SENDGRID_SENDER,
        subject: 'CSDS Event Request creation confirmation.',
        html: msgContent
    };

    return SGMail.send(msg);
};

/**
 * 
 */
exports.sendEvtApprovalRejection_Requestor = function(isApproved, reqEmail, eventDetails) {
    // dont send mails when there are no details
    if (!reqEmail || ! eventDetails) {
        return 
    }

    let msgContent = '';
    let msgSubject = isApproved ? 'CSDS event request approved.' : 'CSDS event request rejected.';

    if (isApproved) {
        msgContent += '<strong>The following CSDS event request has been approved by the administrator.</strong></br>';
    } else {
        msgContent += '<strong>The following CSDS event request has been rejected by the administrator.</strong></br>';
    }

    msgContent += '<p></p>' +
        '<strong>Event Name: ' + eventDetails.eventtitle +'</strong></br>' +
        '<strong>Event ID: ' + eventDetails._id +'</strong></br>' +
        '<p>Description: ' + eventDetails.eventdescription + '</p>' +
        '<p>Location: ' + eventDetails.spacename + '</p>';

    const msg = {
        to: reqEmail,
        from: SENDGRID_SENDER,
        subject: msgSubject,
        html: msgContent
    };

    return SGMail.send(msg);
};