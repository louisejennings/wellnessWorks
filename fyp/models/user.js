var mongo = require('mongodb');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


//User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	location:{
		type: String
	},
	name: {
		type: String
	},
	photo:{
		type: String
	},
	gender:{
		type: String
	},
	dept:{
		type: String
	},
	jobtitle:{
		type: String
	},
	myevents:[{	//array of objectIds
        type: mongoose.Schema.Types.ObjectId, //stores document_ids from Event
        ref: 'Event', //use Event model during population
        required: false
    }],
    badges:[{	
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Event', 
        required: false
    }],
	specialBadges:[{	
		type: String
  	}],
    roles: {	//check for "admin" certain pages are only viewable with this permission
    	type: String
    },
    currentEvents:[{	//array of objectIds
        type: mongoose.Schema.Types.ObjectId, //stores document_ids from Event
        ref: 'Event', //use Event model during population
        required: false
    }],
    //NEW
    resetPasswordToken: String,
  	resetPasswordExpires: Date
});

var User = module.exports = mongoose.model('User',UserSchema)|| db.model('User',schema);

//Get User by ID
module.exports.getAll = function(callback){ 
	User.find().exec(callback);	
}

//User Functions
//Create User
module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt){	//hash the password 
		bcrypt.hash(newUser.password, salt, function(err, hash){
			newUser.password = hash;//Store has in your password DB
			newUser.save(callback);
		});
	});
}

//Get Username
module.exports.getUserByUsername = function(username, callback) {
	var query = {username: username};
	User.findOne(query, callback);
}
//Get user by ID
module.exports.getUserById= function(id, callback){
	User.findOne({_id: id})
        .populate('myevents')
        .populate('badges')	
        .populate('currentEvents')
        .exec(callback);
}

//Compare Password
module.exports.comparePassword= function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err,isMatch){
		if(err) throw err;
		callback(null,isMatch);
	});
}

//Add to myevents
module.exports.addMyEvent= function(id, event, callback){
	User.findByIdAndUpdate(id,{$addToSet: {"myevents": event}}, callback);
	//adds to events array in user collection in db if does not exist
}


//Delete from myevents
module.exports.deleteMyEvent= function(id, event, callback){
	User.findByIdAndUpdate(id,{$pull: {"myevents": event}}, callback);
}

//Add Badge
module.exports.addBadge= function(id, event, callback){
	User.findByIdAndUpdate(id,{$addToSet: {"badges": event}}, callback);//adds to badge array in user collection in db 
}

//Add Special Badge
module.exports.addSpecialBadge= function(userID, specialBadges, comment, callback){
	var specialBadges = specialBadges+" - "+comment;
	User.findByIdAndUpdate(userID,{$push: {"specialBadges": specialBadges}}, callback);//adds to badge array in user collection in db 
}


//Current Event
module.exports.addCurrentEvent= function(userID, newCurrentEvent, callback){
	User.findByIdAndUpdate(userID,{$addToSet: {"currentEvents": newCurrentEvent}}, callback);
	//adds to events array in user collection in db if does not exist
}


