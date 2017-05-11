var mongo = require('mongodb');
var mongoose = require('mongoose');

var EventSchema = mongoose.Schema({
	eventName: {
		type: String,
		index: true
	},
	eventID: {
		type: String
	},
	trackerID: {
		type: String
	},
    attendList:[{	//array of objectIds
        type: mongoose.Schema.Types.ObjectId, //stores document_ids from Event
        ref: 'User', //use User model during population
        required: false
    }]
});

var Event = module.exports = mongoose.model('Event',EventSchema);

module.exports.createEvent = function(newEvent, callback){
	newEvent.save(callback);
}

//Get event by ID
module.exports.getEventById= function(id, callback){
	Event.findOne({_id: id})
	.populate('attendList')
        .exec(callback);
}

//Add User to Event 
module.exports.addUserAttendList = function(id, userID, callback){ 
	Event.findByIdAndUpdate(id,{$addToSet: {"attendList": userID}}, callback); //add userID to Attendlist 
}
