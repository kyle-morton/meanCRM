// BASE SETUP
// ======================================

//GET CONFIG FILE
var config = require('./config');

// CALL THE PACKAGES --------------------
var express    = require('express');		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser'); 	// get body-parser
var morgan     = require('morgan'); 		// used to see requests
var mongoose   = require('mongoose');
var port       = config.port;
var path 	   = require('path');
var multer 	   = require('multer');

// APP CONFIGURATION ---------------------

//use multer middleware to handle multipart requests
// app.use(multer({
// 	dest:  './uploads'
// }).single('file'));

// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser({limit: '5mb'})); //set large size limit for files
app.use(bodyParser.json());


// configure our app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});


// log all requests to the console 
app.use(morgan('dev'));

//connect to our database
mongoose.connect(config.database);

// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));

// ROUTES FOR OUR API
// ======================================

// REGISTER OUR ROUTES -------------------------------
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);


/* Catchall comes after api routes so catchall only catches non-api routes! */

//MAIN CATCHALL ROUTE -> Redirect users to index page so angular can take over!
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);