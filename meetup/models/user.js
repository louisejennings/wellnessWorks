var mongo = require('mongodb');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//User Schema
var UserSchema = mongoose.Schema({
	name: {
		type: String,
		index: true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	username: {
		type: String
	},
	api_key:{
		type: String
	},
	meetupUserID:{
		type: String
	},
    trackedEvents:[{	//array of objectIds
        type: mongoose.Schema.Types.ObjectId, //stores document_ids from Event
       	ref: 'Event', //use Event model during population
    	required: false
    }]
});

var User = module.exports = mongoose.model('User',UserSchema);

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
        .exec(callback);
}

//Compare Password
module.exports.comparePassword= function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err,isMatch){
		if(err) throw err;
		callback(null,isMatch);
	});
}

//Add API key
module.exports.addAPI= function(userID, api_key, callback){
	User.findByIdAndUpdate(userID,{$set: {"api_key": api_key}}, callback); //sets/overrides api key to user
}

//Add Meetup UserID 
module.exports.addMeetupUserID= function(userID, meetupUserID, callback){
	User.findByIdAndUpdate(userID,{$set: {"meetupUserID": meetupUserID}}, callback); //sets/overrides meetupUserID to user
}

//Add User to Attending Report 
/*module.exports.createReport= function(userID, eventID, callback){
	User.findByIdAndUpdate(userID,{$addToSet: {"reports": eventID}}, callback);//adds to badge array in user collection in db 
}*/


//Add Tracked Event to User 
module.exports.addEvent= function(id, event, callback){
	User.findByIdAndUpdate(id,{$addToSet: {"trackedEvents": event}}, callback);//adds to trackedEvents in User collection
}

//Get Tracked Events
module.exports.getTrackedEvents= function(id, callback){
	User.findOne({_id: id})
        .populate('trackedEvents')	//get trackedEvents to use on Home Page
        .exec(callback);
}

//Delete Tracked Event from Users TrackedEvents Array
module.exports.deleteTrackedEvent= function(id, event, callback){
	User.findByIdAndUpdate(id,{$pull: {"trackedEvents": event}}, callback);
}