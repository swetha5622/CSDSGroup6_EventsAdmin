const express = require('express');
const router = express.Router();

const event_controller = require('../controllers/event.controller');

// GET Requests
router.get('/test', event_controller.test);
router.get('/createevent', event_controller.renderCreateEventForm);

// POST Requests
router.post('/create', event_controller.createNewEvent);

module.exports = router;
