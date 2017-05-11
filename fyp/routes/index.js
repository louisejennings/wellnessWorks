var express = require('express'); //include express
var router = express.Router();	//set up Router
var fs = require('fs'); //file system
var Event = require('../models/event');
var helpers = require('../middleware/helpers');
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
router.get('/',ensureAuthenticated,function(req, res) { //Event Dashboard - show all events in db
  Event.getAll(function(err, events) {
  	//console.log(events);
    res.render('index', { events: events, title: "Welcome" });
  });
});


//Login
router.get('/badges', ensureAuthenticated,function(req, res){ //get request for /login 
  res.render('badges', {title: "Badges"});  //render login.handlebars view
});


module.exports = router; 