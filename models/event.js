var mongoose = require('mongoose');

var Event = new mongoose.Schema({
	id: String,
	type: String,
	isoTimestampSent: String,
	isoTimestampReceived: String,
	responseId: String,
	data: Object,
});

module.exports = mongoose.model('Event', Event);
