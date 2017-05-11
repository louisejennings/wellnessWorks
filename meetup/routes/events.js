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

router.get('/trackAttendance/:id',ensureAuthenticated, function(req, res) {	//Create a new Event to Track
	var idAndEvent = req.params.id;	
	var array = idAndEvent.split(".", 2);
	var eventID = array[0];  
	var eventName = array[1];

	var trackerID = req.user.id;

	var newEvent = new Event({	
		eventName: eventName,
		eventID: eventID,
		trackerID: trackerID		
	});

	Event.createEvent(newEvent, function(err, event){ 
		var id = req.user.id;
		User.addEvent(id, event, function(err, user){	//Event added to Users trackedEvent array
			res.render('trackAttendance',{event: event});
		})
  	});
});

//Display Register Attendance Page 
router.get('/attendance/:id',ensureAuthenticated, function(req, res) {	
	var id = req.params.id;			
	Event.findById(id, function(err, event) {
	    res.render('attendance',{event: event}); //render NFC page with event details and display username 
  	});
});


//Add User to Event Attendance List
router.get('/attendList/:id',ensureAuthenticated,function(req, res) { //get event by id
    var eventID = req.params.id;
    var userID = req.user.id;
    Event.addUserAttendList(eventID, userID, function(err, event){   //go to Event model and use method getEventById 
        res.redirect('/'); 
  	 })
});


//Display Attendance Report page
router.get('/attendanceReport/:id',ensureAuthenticated, function(req, res) {	
	var id = req.params.id;	
	var userID = req.user.id;
	Event.getEventById(id, function(err, event) {
		res.render('attendanceReport',{event: event}); 
	});
});

module.exports = router; 

