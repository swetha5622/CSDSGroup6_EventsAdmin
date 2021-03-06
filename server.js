// =============================================
/**
 * CSDS Events Admin
 * 
 * @author Swetha Srinivasan
 * 
 */
// =============================================
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nconf = require('nconf');

// Read in keys and secrets. Using nconf we can set secrets via
// environment variables, command-line arguments, or a keys.json file.
nconf.argv().env().file('keys.json');

let dbConnSuccess = function() {

    // initialize our Express app
    const app = express();

    // set up Pug - html templating engine 
    app.set('view engine', 'pug');
    app.locals.basedir = app.get('views');

    // set up BodyParser
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    const csds_event = require('./routes/event.route');

    app.get('/', (req, res) => {
        res
            .status(200)
            .send('Hello from the CSDS Events Admin application!  Courtesy of Group 6 2019...')
            .end();
        });
    
    //app.use('/csdsevents', csds_event);
    app.use(nconf.get('base_route'), csds_event);

    const port = nconf.get('appPort');

    app.listen(port, () => {
        console.log('Test Server is up nd running on port ' + port);
    });

};

const user = nconf.get('mongoUser');
const pass = nconf.get('mongoPass');
const host = nconf.get('mongoHost');
const port = nconf.get('mongoPort');

let dev_db_url = `mongodb+srv://${user}:${pass}@${host}`;
if (nconf.get('mongoDatabase')) {
    dev_db_url = `${dev_db_url}/${nconf.get('mongoDatabase')}?retryWrites=true`;
}
// console.log(dev_db_url);

mongoose.connect(dev_db_url, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('disconnected', console.error.bind(console, 'MongoDB disconnected:'));
db.on('connected', dbConnSuccess);
