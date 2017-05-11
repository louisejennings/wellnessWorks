var mongo = require('mongodb');
var mongoose = require('mongoose');

var EventSchema = mongoose.Schema({
	eventName: {
		type: String,
		index: true
	},
	date: {
		type: String
	},
	startTime: {
		type: String
	},
	endTime: {
		type: String
	},
	category:{
		type: String //check boxes
	},
	location:{
		type: String
	},
	image: {
		type: String
	},
	capacity:{
		type: String
	},
	info:{
		type: String
	},
	badges:{
		type: String
	},
	rsvps:[{	//array of objectIds
        type: mongoose.Schema.Types.ObjectId, //stores document_ids from Event
        ref: 'User', //use User model during population
        required: false
    }],
    attendList:[{	//array of objectIds
        type: mongoose.Schema.Types.ObjectId, //stores document_ids from Event
        ref: 'User', //use User model during population
        required: false
    }],
    dateCreated: { type: Date, default: Date.now }, //add date now
    eventType:{
		type: String
	},
	eventCategory: {
		type: String
	},
	creatorName: {
		type: String
	}
});

var Event = module.exports = mongoose.model('Event',EventSchema);

//Get Event by ID
module.exports.getAll = function(callback){ 
	Event.find().exec(callback);	
	//.populate('rsvps')
}

//Get Event by ID
module.exports.getEventById = function(id, userID, callback){ 
	Event.findByIdAndUpdate(id,{$addToSet: {"rsvps": userID}}, callback); //add userID to RSVP of event
}

//Delete UserID from RSVP
module.exports.deleteEventById = function(id, userID, callback){ 
	Event.findByIdAndUpdate(id,{$pull: {"rsvps": userID}}, callback);
}

//Get RSVP userId List
module.exports.getMoreInfo = function(id, callback){
	Event.findOne({_id: id})
        .populate('rsvps')	//get RSVPs to use on Analytics page
        .populate('attendList')	//get attendList to use on Analytics page
        .exec(callback);
}

//Create Event
module.exports.createEvent = function(newEvent, callback){
	newEvent.save(callback);
}

//Create Event
module.exports.createCurrentEvent = function(newCurrentEvent, callback){
	newCurrentEvent.save(callback);

}

//Get Event by ID
module.exports.addUserAttendList = function(eventID, userID, callback){
	Event.findByIdAndUpdate(eventID,{$addToSet: {"attendList": userID}}, callback); //add the creator ID to attendlist 
}


//Delete from RSVP and Attending
/*module.exports.deleteRecords= function(id, callback){
	Event.findByIdAndUpdate(id,{$pull: {"myevents": id, "rsvps": id}}, callback);
}*/
