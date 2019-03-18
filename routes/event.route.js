const express = require('express');
const router = express.Router();

const event_controller = require('../controllers/event.controller');

// GET Requests
router.get('/test', event_controller.test);
router.get('/createspecialeventrequestform', event_controller.renderSpecialEventRequestForm);
router.get('/listapprovedevents', event_controller.listApprovedEvents);
// FIXME: reject needs to be a POST request..
router.get('/:id/rejectreq', event_controller.rejectReq);

// POST Requests
router.post('/createspecialeventrequest', event_controller.createspecialeventrequest);
router.post('/:id/approvereq', event_controller.approveReq);

module.exports = router;
