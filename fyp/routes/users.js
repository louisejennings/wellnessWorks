var express = require('express'); //include express
var router = express.Router();	//set up Router
var User = require('../models/user'); //Model User
var Event = require('../models/event'); //Model Event
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var assert = require('assert'); //check for errors
var helpers = require('../middleware/helpers');

function ensureAuthenticated(req, res, next){ //redirect if not logged in
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
}

//Register
router.get('/register', function(req, res){ //get request for /register 
	res.render('register', {title: "Register"});	//render register.handlebars view
});

//Login
router.get('/login', function(req, res){ //get request for /login 
	res.render('login', {title: "Login"});	//render login.handlebars view
});

//Add User
router.get('/adminAddUser', ensureAuthenticated,function(req, res){ //get request for /adminAddUser 
	res.render('adminAddUser', {title: "Add User"});	//render adminAddUser.handlebars view
});

//Register User
router.post('/register', function(req, res){ //post register user details
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var photo = req.body.photo;
	var roles = "user"; //Set role to user
	var gender = req.body.gender;
	var dept = req.body.dept;
	var location = req.body.location;
	var jobtitle = req.body.jobtitle;

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
		var newUser = new User({	//create User
			name: name,
			email: email,
			username: username,
			password: password,
			photo: photo,
			roles: roles,
			gender: gender,
			dept: dept,
			location: location,
			jobtitle: jobtitle 
								
		});
		//else create user
		User.createUser(newUser, function(err, user){
			if (err) throw err;
		});

		req.flash('success_msg', 'You are registered and can now login'); //success message
		res.redirect('/users/login');	//redirect 
	}
});

//Admin Add New User
router.post('/adminAddUser', ensureAuthenticated,function(req, res){ //post register user details
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var photo = req.body.photo;
	var roles = req.body.roles;
	var gender = req.body.gender;
	var dept = req.body.dept;
	var location = req.body.location;
	var jobtitle = req.body.jobtitle;

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
		res.render('adminAddUser',{ 
			errors:errors
		});
	}else{
		var newUser = new User({	
			name: name,
			email: email,
			username: username,
			password: password,
			photo: photo,
			roles: roles,
			gender: gender,
			dept: dept,
			location: location,
			jobtitle: jobtitle 
								
		});
		//else create user
		User.createUser(newUser, function(err, user){
			if (err) throw err;
		});

		res.redirect('/users/userList');	//redirect 
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
		res.render('userProfile', { user: user, title: "User Profile" }); //display user details from collection
	});    
});

//Get User Profile details from db
router.get('/edit/:id', ensureAuthenticated,function(req, res){
	var id = req.params.id;
  User.findById(id, function(err, user) {
     res.render('editProfile', {user : user, title: "Edit Profile"});
  });
});


//User can edit User profile and save new details to db
router.post('/edit/:id', ensureAuthenticated,function(req, res){
	var id = req.params.id;
	User.findById(id, function(err, user){
		user.name = req.body.name;
		user.username = req.body.username;
		user.email = req.body.email;
		user.photo = req.body.photo;
		user.gender = req.body.gender;
		user.location = req.body.location;
		user.dept = req.body.dept;
		user.jobtitle = req.body.jobtitle;
		user.save();
		res.redirect('/users/userProfile'); 
	});
});

//ADMIN Get User Profile details from db
router.get('/edit/admin/:id',ensureAuthenticated, function(req, res){
	var id = req.params.id;
  User.findById(id, function(err, user) {
     res.render('adminEditProfile', {user : user, title: "User List"}); //named user list to show admin options on sideNav
  });
});

//ADMIN User can edit User profile and save new details to db
router.post('/edit/admin/:id', ensureAuthenticated,function(req, res){
	var id = req.params.id;
	User.findById(id, function(err, user){
		user.name = req.body.name;
		user.username = req.body.username;
		user.email = req.body.email;
		user.roles = req.body.roles;
		user.photo = req.body.photo;
		user.gender = req.body.gender;
		user.location = req.body.location;
		user.dept = req.body.dept;
		user.jobtitle = req.body.jobtitle;
		user.save();

		if (user.roles=="user"){	//if admin turns into user role redirect to homepage
			res.redirect('/');
		}
		else{
			res.redirect('/users/userList'); //if admin redirect to userlist page
		}	
	});
});

//Delete User
router.get('/delete/:id', ensureAuthenticated,function(req, res) {
    var userToDelete = req.params.id.toString();
        User.remove({"_id":userToDelete}, function(err, result) { 
        	res.redirect('/users/userList'); 
   		})
});

//Display Events
router.get('/myevents/eventList/',ensureAuthenticated,function(req, res) {
	var userID = req.user.id;
	User.getUserById(userID, function(err,user){
		res.render('eventList', { user: user, title: "My Events" });	//render the details on eventList page
	});    
});

//Add Event to User
router.get('/myevents/:id',ensureAuthenticated,function(req, res) { //get event by id
	var id = req.params.id;
	var userID = req.user.id;
	Event.getEventById(id, userID, function(err, event){	//go to Event model and use method getEventById 
		User.addMyEvent(userID, event, function(err, user){ //go to User model and use addMyEvent
			res.redirect('/'); //
		})
	})
});

//Delete Event to User
router.get('/myevents/delete/:id',ensureAuthenticated, function(req, res) { //
	var id = req.params.id;
	var userID = req.user.id;
	Event.deleteEventById(id, userID, function(err, event){//go to Event model and use method deleteEventById 
		User.deleteMyEvent(userID, id, function(err, user){ //go to User model and use deleteFavourite
			res.redirect('/users/myevents/eventList'); //
		})
	})
});

//UserList
router.get('/userList',ensureAuthenticated, function(req, res){ // 
	User.getAll(function(err, users){
		res.render('userList', {users: users, title: "User List"});	//render userList.handlebars view
	});
});

//Display Users Badges
router.get('/mybadges',ensureAuthenticated,function(req, res) {
	var userID = req.user.id;
	User.getUserById(userID, function(err,user){
		res.render('badges', { user: user, title: "Badges" });	
	});    
});

//View User Report
router.get('/reports/:id',ensureAuthenticated,function(req, res) { //get event by id
	var userID = req.params.id;
	User.getUserById(userID, function(err,user){
		res.render('userReport', { user: user, title: "User List" });	
	}); 
});

//Add Current Event to User
router.get('/currentEvents/:id',ensureAuthenticated,function(req, res) { //get event by id
	var eventID = req.params.id;
	var userID = req.user.id;

	Event.addUserAttendList(eventID, userID, function(err, event){	//go to Event model and use method getEventById 
		User.addCurrentEvent(userID, eventID, function(err, user){ //go to User model and use addMyEvent
			res.redirect('/'); //
		})
	})
});

//Add Special Badges
router.post('/specialBadges', ensureAuthenticated,function(req, res){ 
	var userID = req.body.userID;
	var specialBadges = req.body.specialBadges;
	var comment = req.body.comment;
	User.addSpecialBadge(userID, specialBadges, comment, function(err, user){
		res.redirect('userList');	
	})
});

module.exports = router;





