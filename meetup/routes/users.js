var express = require('express'); //include express
var router = express.Router();	//set up Router
var User = require('../models/user');
var Event = require('../models/event');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var assert = require('assert'); //check for errors

function ensureAuthenticated(req, res, next){ //only allow dashboard to show if logged in
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
}

//Register
router.get('/register', function(req, res){ //get request for /register 
	res.render('register');	//render register.handlebars view
});

//Login
router.get('/login', function(req, res){ //get request for /login 
	res.render('login');	//render login.handlebars view
});

//Register User
router.post('/register', function(req, res){ //post register user details
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	//var photo = req.body.photo;

	//Validation
	req.checkBody('name','Name is required').notEmpty();
	req.checkBody('email','Email is required').notEmpty();
	req.checkBody('email','Email is not valid').isEmail();
	req.checkBody('username','Username is required').notEmpty();
	req.checkBody('password','Password is required').notEmpty();
	req.checkBody('password2','Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();
	//if errors render register view again
	if(errors){
		res.render('register',{ 
			errors:errors
		});
	}else{
		var newUser = new User({	
			name: name,
			email: email,
			username: username,
			password: password,
								
		});
		//else create user
		User.createUser(newUser, function(err, user){
			if (err) throw err;
		});

		req.flash('success_msg', 'You are registered and can now login'); //success message
		res.redirect('/users/login');	//redirect 
	}
});

passport.use(new LocalStrategy( //gets username finds if there is one that matches, then validates password.
	function(username, password, done){
		User.getUserByUsername(username, function(err, user){	//get username
			if (err) throw err;
			if (!user){											//check if exists
				return done(null, false, {message: 'Unknown User'});
			}
			User.comparePassword(password, user.password, function(err, isMatch){ //get password 
				if (err) throw err;
				if (isMatch){													//check if matches users password that is saved
					return done(null,user);
				}else{
					return done(null,false, {message:'Invalid password'});		
				}
			});
		});
	}));

passport.serializeUser(function(user,done){	//user.id saved in session
	done(null,user.id);
});

passport.deserializeUser(function(id,done){
	User.getUserById(id, function(err,user){ //whole object retrieved using user.id
		done(err,user);	//object attached to req.user
	});
});

router.post('/login', passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: '/users/login', failureFlash: 'Invalid username or password.' }));


//Logout
router.get('/logout', function(req, res){
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/users/login');
});

//Display user details on UserProfile page
router.get('/userprofile/', ensureAuthenticated,function(req, res) {	
	var userID = req.user.id;
	User.getUserById(userID, function(err,user){
		res.render('userProfile', { user: user }); //display user details from collection
	});    
});


//Get User Profile details from db
router.get('/edit/:id', ensureAuthenticated,function(req, res){
	var id = req.params.id;
  User.findById(id, function(err, user) {
     res.render('edit',
     	{user : user});
  });
});

//Edit User profile and save new details to db
router.post('/edit/:id', ensureAuthenticated,function(req, res){
	var id = req.params.id;
	User.findById(id, function(err, user){
		user.name=req.body.name;
		user.username=req.body.username;
		user.password=req.body.password;
		user.password2=req.body.password2;
		user.email=req.body.email;
		//user.photo=req.body.photo;
		user.save();

		res.redirect('/users/userProfile');
	});
});

//Get API from Settings
router.post('/api', ensureAuthenticated,function (req, res) {
	var api_key = req.body.api_key;
	var userID = req.user.id;
		User.addAPI(userID, api_key, function(err, user){ //go to User model and use addAPI
			res.redirect('/settings'); //redirect to Settings
		})
});

//Get Meetup UserID from Settings
router.post('/meetupUserID', ensureAuthenticated,function (req, res) {
	var meetupUserID = req.body.meetupUserID;
	var userID = req.user.id;
		User.addMeetupUserID(userID, meetupUserID, function(err, user){ //go to User model and use addMeetupUSERID
			res.redirect('/settings'); //redirect to Settings
		})
});

//Delete Tracked Event
router.get('/deleteTracking/:id',ensureAuthenticated, function(req, res) { 
	var id = req.params.id;
	var userID = req.user.id;
	User.deleteTrackedEvent(userID, id, function(err, user){	//delete from User trackedEvents array
		Event.remove({"_id":id}, function(err, result) { 	//delete from Events collection
			res.redirect('/'); 
		})
	})
});


/*--------TESTING------------*/
























module.exports = router;





