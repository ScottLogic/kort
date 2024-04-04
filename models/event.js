var mongoose = require('mongoose');

var Event = new mongoose.Schema({
	id: String,
	type: String,
	iso_timestamp_sent: String,
	iso_timestamp_received: String,
	tree_test_id: String,
	data: Object,
});

module.exports = mongoose.model('Event', Event);
