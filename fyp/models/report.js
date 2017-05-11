var mongo = require('mongodb');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


//User Schema
var ReportSchema = mongoose.Schema({
	name: {
		type: String,
		index: true
	},
	eventId: {
		type: String
	}
});

var Report = module.exports = mongoose.model('Report',ReportSchema)|| db.model('Report',schema);



