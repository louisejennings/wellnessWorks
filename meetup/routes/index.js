var express = require('express'); //include express
var router = express.Router();	//set up Router

var fs = require('fs'); //file system
var User = require('../models/user');
var Event = require('../models/event');

var mongo = require('mongodb');
var mongoose = require('mongoose');

function ensureAuthenticated(req, res, next){ //only allow dashboard to show if logged in
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
}

//Display all events on homepage
router.get('/',ensureAuthenticated, function(req, res) { //Event Dashboard - show all events in db
	var id = req.user.id;
    User.getTrackedEvents(id, function(err, user) {
    	res.render('index', { user: user });
  	});
});

//Settings
router.get('/settings',ensureAuthenticated, function(req, res){ //get request for /settings 
	res.render('settings');	//render settings.handlebars view
});


module.exports = router; 
