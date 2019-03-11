const express = require('express');
const router = express.Router();

const event_controller = require('../controllers/event.controller');

// a simple test url to check that all of our files are communicating correctly.
router.get('/test', event_controller.test);
router.get('/newtest', event_controller.newtest);

module.exports = router;
