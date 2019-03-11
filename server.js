//https://stackoverflow.com/questions/38012797/google-app-engine-502-bad-gateway-with-nodejs


const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nconf = require('nconf');

// Read in keys and secrets. Using nconf use can set secrets via
// environment variables, command-line arguments, or a keys.json file.
nconf.argv().env().file('keys.json');

let dbConnSuccess = function() {

    // initialize our Express app
    const app = express();

    // set up Pug - html templating engine 
    app.set('view engine', 'pug');

    // set up BodyParser
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    const csds_event = require('./routes/event.route');

    app.get('/', (req, res) => {
        res
            .status(200)
            .send('Hello, world!')
            .end();
        });
    
    app.use('/csdsevents', csds_event);

    const port = nconf.get('appPort');

    app.listen(port, () => {
        console.log('Test Server is up nd running on port ' + port);
    });

};

const user = nconf.get('mongoUser');
const pass = nconf.get('mongoPass');
const host = nconf.get('mongoHost');
const port = nconf.get('mongoPort');

// let dev_db_url = `mongodb+srv://${user}:${pass}@${host}:${port}`;
let dev_db_url = `mongodb+srv://${user}:${pass}@${host}`;
if (nconf.get('mongoDatabase')) {
    dev_db_url = `${dev_db_url}/${nconf.get('mongoDatabase')}?retryWrites=true`;
}
console.log(dev_db_url);

// const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(dev_db_url, { useNewUrlParser: true });
// mongoose.connect(nconf.get('mongoConn'))
mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('disconnected', console.error.bind(console, 'MongoDB disconnected:'));
db.on('connected', dbConnSuccess);
