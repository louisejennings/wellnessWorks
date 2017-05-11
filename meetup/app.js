//import modules required for the project
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var expressHandlebars = require('express-handlebars');
var expressValidator = require('express-validator');
var expressSession = require('express-session');
var chalk = require('chalk');

var cookieParser = require('cookie-parser');
var connectFlash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var fs = require('fs'); //file system

 //routes are defined here
var routes = require('./routes/index');
var users = require('./routes/users');
var events = require('./routes/events');


//Initialize an Express Application
var app = express();

//Set up local and mongolab
if(process.env.MONGODB_URI) {
	 mongoose.connect(process.env.MONGODB_URI);
}else {
	var db = 'mongodb://localhost/meetup';
 	mongoose.connect(db, function(err){ 
		if(err){
   			console.log(err);
  		}else {
   		console.log('mongoose connection is successful on: ' + db);
  		}
 	});
}

var expH = expressHandlebars.create({
    layoutsDir:__dirname + '/views/layouts/'
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
app.use(expressSession({
	secret: 'Meetup+',
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
app.use(connectFlash());

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


app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});


/*------------END TESTING MEETUP-------------------*/
module.exports = app;
