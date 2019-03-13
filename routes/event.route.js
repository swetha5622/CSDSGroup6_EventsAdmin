const express = require('express');
const router = express.Router();

const event_controller = require('../controllers/event.controller');

// GET Requests
router.get('/test', event_controller.test);
router.get('/createevent', event_controller.renderCreateEventForm);
router.get('/listevents', event_controller.listEvents);

// POST Requests
router.post('/create', event_controller.createNewEvent);

// DELETE Requests
router.delete('/:id/delete', event_controller.deleteEvent);

module.exports = router;
