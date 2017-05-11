//import modules required for the project
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHandlebars = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('express-flash');
//var connectFlash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');

//Initialize an Express Application
var app = express();

//Set up local and mLab MongoDB
if(process.env.MONGODB_URI) {
	 mongoose.connect(process.env.MONGODB_URI);
}else {
	var db = 'mongodb://localhost/fyp';
 	mongoose.connect(db, function(err){ 
		if(err){
   			console.log(err);
  		}else {
   		console.log('mongoose connection is successful on: ' + db);
  		}
 	});
}


var fs = require('fs'); //file system

var helpers = require('./middleware/helpers');

 //routes are defined here
var routes = require('./routes/index');
var users = require('./routes/users');
var events = require('./routes/events');


var expH = expressHandlebars.create({
    helpers: helpers,
    layoutsDir:__dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
});

//View Engine
app.engine('handlebars', expH.engine);
app.set('views', path.join(__dirname, 'views')); //folder called 'views'
app.engine('handlebars', expressHandlebars({defaultLayout:'layout'})); //set handlebars as the app.engine and the default layout file is 'layout.handlebars'
app.set('view engine', 'handlebars'); //set the view engine to handlebars


//BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//Declare public directory to be used as a store for static files
app.use(express.static(path.join(__dirname, 'public'))); 

//Express Session (Middleware for Express Session)
app.use(session({
	secret: 'FinalYearProject',
	saveUninitialized: true,
	resave: true
}));


//Passport Initialisation
app.use(passport.initialize());
app.use(passport.session());

//Express Validator (Middleware for Express Validator)
app.use(expressValidator({
	errorFormatter: function(param, msg, value){
		var namespace = param.split('.'),
		root = namespace.shift(),
		formParam = root;

		while(namespace.length){
			formParam += '[' + namespace.shift() + ']';
		}
		return{
			param : formParam,
			msg : msg,
			value : value
		};
	}
}));

//Connect Flash (Middleware for Connect Flash)
app.use(flash());
//app.use(connectFlash());

//Global Variables for Flash Connect
app.use(function (req, res, next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error'); //this line is needed because flash set their own flash messages
	res.locals.user = req.user || null; //if user is there we can access from anywhere otherwise null
	next();
});

//Middleware for route files
app.use('/', routes); //brings you to index file
app.use('/users', users);
app.use('/events', events); 




/*-------------------------NFC----------------------------*/






/*-------------------------NFC-END----------------------------*/


//WORKING//
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});


module.exports = app;
