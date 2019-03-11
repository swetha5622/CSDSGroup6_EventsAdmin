const Event = require('../models/event.model');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};

exports.newtest = function (req, res) {
    res.send('Swetha srinivasan says hello.... ');
};