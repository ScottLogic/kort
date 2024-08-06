// User defined settings -------------------------------------------

//load in environment variables
require('dotenv').config();

//https://docs.mongodb.com/manual/reference/connection-string/
//with a username and password: 'mongodb://kort:123@127.0.0.1/kort'
const DEFAULT_MONGO_HOST = "127.0.0.1";
const MONGO_PORT = "27017";
const MONGO_DATABASE = "kort";
const mongoHost = process.env.MONGO_HOST || DEFAULT_MONGO_HOST;

var mongoURL = "mongodb://";

const mongo_kort_username = process.env.MONGO_KORT_USERNAME
const mongo_kort_password = process.env.MONGO_KORT_PASSWORD

if ((mongo_kort_username && !mongo_kort_password) || (!mongo_kort_username && mongo_kort_password)   ) {
    var err =
      "Missing 'MONGO_KORT_USERNAME' or 'MONGO_KORT_PASSWORD' environment variable.\n"+
      "Both must be specified to create a kort db user";
    console.warn(err);
    throw new Error(err);
  }
else if (mongo_kort_username && mongo_kort_password) {
  mongoURL += mongo_kort_username + ":" + mongo_kort_password + "@";
}

mongoURL += mongoHost + ":" + MONGO_PORT;
mongoURL += "/" + MONGO_DATABASE;
if (process.env.MONGO_OPTIONS) {
  mongoURL += "?" + process.env.MONGO_OPTIONS;
}

const port = process.env.PORT || 3000;

//default Kort admin user and password
const DEFAULT_KORT_ADMIN_USER = 'admin';
const DEFAULT_KORT_ADMIN_PASSWORD = 'admin';
const kortAdminUser = process.env.KORT_ADMIN_USER || DEFAULT_KORT_ADMIN_USER;
const kortAdminPassword = process.env.KORT_ADMIN_PASSWORD || DEFAULT_KORT_ADMIN_PASSWORD;
if (kortAdminUser === DEFAULT_KORT_ADMIN_USER && kortAdminPassword === DEFAULT_KORT_ADMIN_PASSWORD) {
    console.warn("No Kort admin user and/or password set, using default " + DEFAULT_KORT_ADMIN_USER + "/"+ DEFAULT_KORT_ADMIN_PASSWORD);
}

const allowGoogleAuth = false; //allowUserRegistration must be set to true as well to enable this
const allowUserRegistration = false;

//Google Authentication (via OAuth2) (Optional)
const googleClientID = '';
const googleClientSecret = ''; //DO NOT SHARE THIS!
const googleCallbackURL = 'http://127.0.0.1:'+port+'/auth/google/callback'; //only change the port and anything before it


//------------------------------------------------------------------

//used for hash creation and salting
const { v4: uuidv4 } = require('uuid');
const secretHash = uuidv4(); //use uuid as random secret hash for sessions
//on restart, this will be regenerated and all user sessions will be reset

const compression = require('compression');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser= require('body-parser');
var app = express();
//https://expressjs.com/en/advanced/best-practice-security.html
//https://helmetjs.github.io/docs/
const environment = process.env.ENVIRONMENT || 'production';
const helmet = require('helmet');
const defaultCspOptions = helmet.contentSecurityPolicy.getDefaultDirectives();
delete defaultCspOptions["upgrade-insecure-requests"]


if (environment !== 'production') {
  app.use(helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: { ...defaultCspOptions },
     }
   })
 );
} else {
  app.use(helmet());
}

const flash = require('connect-flash');
var logger = require('./server/logger.js');
const path = require('path');

// set up rate limiter: maximum of 120 requests per 10 seconds
const DEFAULT_RATE_LIMIT = 120;
const requestRateLimit = process.env.RATE_LIMIT  || DEFAULT_RATE_LIMIT;

var rateLimit = require('express-rate-limit');
var limiter = rateLimit({
  windowMs: 1*10*1000, // 10 seconds
  max: requestRateLimit
});
// apply rate limiter to all requests
app.use(limiter);

require('pkginfo')(module, 'version');
logger.info("Kort version: " + module.exports.version);

//use default ES6 for promises, potential for using bluebird for increased performance
//https://stackoverflow.com/questions/38138445/node3341-deprecationwarning-mongoose-mpromise
mongoose.Promise = global.Promise;
//https://stackoverflow.com/questions/23293202/export-and-reuse-my-mongoose-connection-across-multiple-models
//https://stackoverflow.com/questions/44749700/how-to-set-usemongoclient-mongoose-4-11-0
//setting useMongoClient: true is no longer necessary in Mongoose 5.X
//https://github.com/Automattic/mongoose/blob/master/migrating_to_5.md
//https://stackoverflow.com/questions/50448272/avoid-current-url-string-parser-is-deprecated-warning-by-setting-usenewurlpars

//https://mongoosejs.com/docs/deprecations.html#-findandmodify
//https://stackoverflow.com/questions/57895175/server-discovery-and-monitoring-engine-is-deprecated/57899638#57899638
//https://mongoosejs.com/docs/6.x/docs/migrating_to_6.html#no-more-deprecation-warning-options
const clientP = mongoose.connect(mongoURL).then(m => m.connection.getClient())

//load in models
require('./models/user');
require('./models/study');
require('./models/upload');
require('./models/event');

//setup a default Kort admin account in Mongo
require('./server/createadmin_user')(kortAdminUser, kortAdminPassword);

app.set('view engine', 'ejs');

app.use(compression());

// helpful for debugging
//const morgan = require('morgan');
//app.use(morgan('dev')); // log every request to the console

app.use(cookieParser()); // read cookies (needed for auth)

app.use(flash());

//https://stackoverflow.com/questions/14264429/how-to-use-jquery-installed-with-npm-in-express-app
//https://expressjs.com/en/starter/static-files.html
app.use('/css', express.static(path.join(__dirname, '/css/')));
app.use('/opensans', express.static(path.join(__dirname, '/node_modules/npm-font-open-sans/')));
app.use('/dist', express.static(path.join(__dirname, '/dist/')));
app.use('/js', express.static(path.join(__dirname, '/js/')));
app.use('/jquery', express.static(path.join(__dirname, '/node_modules/jquery/dist/')));
app.use('/clipboard', express.static(path.join(__dirname, '/node_modules/clipboard/dist/')));
app.use('/bootstrap', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/')));
app.use('/popperjs', express.static(path.join(__dirname, '/node_modules/@popperjs/core/dist/umd/')));
app.use('/jstree', express.static(path.join(__dirname, '/node_modules/jstree/dist/')));
app.use('/bootbox', express.static(path.join(__dirname, '/node_modules/bootbox/')));
app.use('/font-awesome', express.static(path.join(__dirname, '/node_modules/font-awesome/')));
app.use('/dragula', express.static(path.join(__dirname, '/node_modules/dragula/dist/')));
app.use('/plotlyjs', express.static(path.join(__dirname, '/node_modules/plotly.js/dist/')));
app.use('/datatables', express.static(path.join(__dirname, '/node_modules/datatables.net/js/')));
app.use('/datatables', express.static(path.join(__dirname, '/node_modules/datatables.net-dt/')));
app.use('/datatables-buttons', express.static(path.join(__dirname, '/node_modules/datatables.net-buttons/js/')));
app.use('/datatables-buttons', express.static(path.join(__dirname, '/node_modules/datatables.net-buttons-dt/css/')));
app.use('/public', express.static(path.join(__dirname, '/public/')));

const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
    secret: secretHash,
    store: MongoStore.create({
        mongoUrl: mongoURL,
        clientPromise: clientP,
        collectionName: 'session',
		    ttl: 4 * 60 * 60 // = 4 hours (in seconds)
		}),
	resave: false, // don't save session if unmodified
	saveUninitialized: false // don't create session until something stored
}));

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());
require('./server/passport')(passport, flash, allowGoogleAuth, googleClientID, googleClientSecret, googleCallbackURL);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

require('./server/routes.js')(app, passport, flash, allowGoogleAuth, allowUserRegistration);

const { createServer } = require('node:http');
const httpServer = createServer(app);

const { setupSocketServer } = require('./server/socket.js');
setupSocketServer(httpServer);

httpServer.listen(port, function () {
	logger.info('Kort running on port: ' + port);
});
