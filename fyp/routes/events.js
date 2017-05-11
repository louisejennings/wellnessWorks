var Event = require('../models/event');
var User = require('../models/user'); //Model User
var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var router = express.Router();
var helpers = require('../middleware/helpers');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

function ensureAuthenticated(req, res, next){ //redirect if not logged in
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
}

//Analytics
router.get('/analytics',ensureAuthenticated, function(req, res){ // 
	Event.getAll(function(err, events){
		res.render('analytics', {events: events, title: "Analytics"} );	//render analytics.handlebars view
	});
});


//RSVP User List for Event
router.get('/rsvpList/:id',ensureAuthenticated, function(req, res){ // 
	var id = req.params.id;
	Event.getMoreInfo(id, function(err, event){
		res.render('rsvpList', {event: event, title: "Analytics"});
	});
});

//Create Event
router.get('/createEvent',ensureAuthenticated, function(req, res){ //get request for /createEvent 
	res.render('createEvent', {title: "Create Event"});	//render createEvent.handlebars view
});

//Create Event
router.post('/createEvent', ensureAuthenticated,function(req, res){ //post createEvent details
	var eventName = req.body.eventName;
	var date = req.body.date;
	var startTime = req.body.startTime;
	var endTime = req.body.endTime;
	var category = req.body.category;
	var location = req.body.location;
	var capacity = req.body.capacity;
	var info = req.body.info;
	var image = req.body.image;
	var badges = "./images/badges/"+req.body.category+".png"; //use the category to create the badge url
	//Validation
	req.checkBody('eventName','Event name is required').notEmpty();
	req.checkBody('date','Date is required').notEmpty();
	req.checkBody('startTime','Start time is required').notEmpty();
	req.checkBody('endTime','End time is required').notEmpty();
	req.checkBody('category','Category is required').notEmpty();
	req.checkBody('location','Location is required').notEmpty();
	req.checkBody('capacity','Capacity is required').notEmpty();
	req.checkBody('info','Information is required').notEmpty();
	req.checkBody('image','Event image is required').notEmpty();
	var errors = req.validationErrors();
	//if errors render createEvent view again
	if(errors){
		res.render('createEvent',{ 
			errors:errors
		});
	}else{
		var newEvent = new Event({	
			eventName: eventName,
			date: date,
			startTime: startTime,
			endTime: endTime,
			category: category,
			location: location,
			capacity: capacity,
			info: info,
			image: image,
			badges: badges,
			eventType: "normalEvent"							
		});
		//else create event
		Event.createEvent(newEvent, function(err, event){
			if (err) throw err;
		});
		res.redirect('/'); 
	}
});

//Delete Event
router.get('/delete/:id',ensureAuthenticated, function(req, res) {
    var eventToDelete = req.params.id.toString();
    Event.remove({"_id":eventToDelete}, function(err, result) { 
        res.redirect('/'); 
    });
});

//Get Event details from db
router.get('/edit/:id', ensureAuthenticated, function(req, res){
	var id = req.params.id;
  Event.findById(id, function(err, event) {
     res.render('editEvent',{event : event, title: "Welcome"});
  });
});

//Edit Event and save new details to db
router.post('/edit/:id', ensureAuthenticated, function(req, res){
	var id = req.params.id;
	Event.findById(id, function(err, event){
		event.eventName=req.body.eventName;
		event.date=req.body.date;
		event.startTime=req.body.startTime;
		event.endTime=req.body.endTime;
		event.category=req.body.category;
		event.location=req.body.location;
		event.capacity=req.body.capacity;
		event.badges = "./images/badges/"+req.body.category+".png"; //use the category to create the badge url
		event.info=req.body.info;
		event.image=req.body.image;
		event.save();

		res.redirect('/'); 
	});
});

//Display Attending Event Page
router.get('/reports/:id',ensureAuthenticated, function(req, res) {	
	//var userID = req.cookies.userID;
	var id = req.params.id;			
	Event.findById(id, function(err, event) {
	    res.render('reports',{event: event, title: "Reports"}); //render NFC page with event details and display username 
  	});
});


//Add User to Event Attendance List
router.get('/attendList/:id',function(req, res) { //get event by id
    var eventID = req.params.id;
    var userID = req.user.id;
   // var userID = req.cookies.userID;
    Event.addUserAttendList(eventID, userID, function(err, event){   //go to Event model and use method getEventById 
       User.addBadge(userID, event, function(err, user){ //go to User model and use addToAttendList
            res.redirect('/'); 
        })
  	 })
});

//NFC Instructions
router.get('/nfcInstructions/:id',ensureAuthenticated, function(req, res){ 
	var id = req.params.id;
	Event.findById(id, function(err, event) {
		res.render('nfcInstructions',{event : event, title: "Create Event"});
  	});
});


//Modify Current Event Form
router.get('/createCurEvent/:id',ensureAuthenticated, function(req, res) {	
	var id = req.params.id;
	res.render('createCurrentEvent', {id, title: "Create Current Event Form"});
});



router.post('/currentEvent/', function(req, res) {	
	var eventCategory = req.body.eventCategory;
	var capacity = req.body.capacity;
	var creatorName = req.body.creatorName; //hidden form field

	var newCurrentEvent = new Event({	
		eventCategory: eventCategory,
		creatorName: creatorName,
		capacity: capacity,
		eventType: "currentEvent"
	});

	Event.createCurrentEvent(newCurrentEvent, function(err, event){ //Event created in User's currentEvents
		var eventID = event._id;
		var userID = req.user.id;
		User.addCurrentEvent(userID, newCurrentEvent, function(err, user){	//Event added to Users trackedEvent array
			Event.addUserAttendList(eventID, userID, function(err, user){ //Adds user to event to RSVP List
				res.redirect('/');	
			})
		})
			//res.render('trackAttendance',{event: event});
  	})
});

module.exports = router;