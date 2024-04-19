var mongoose = require('mongoose');

var Event = new mongoose.Schema({
	_id: mongoose.Schema.Types.UUID,
	type: String,
	isoTimestampSent: String,
	isoTimestampReceived: String,
	responseId: String,
	data: Object,
});

module.exports = mongoose.model('Event', Event);
