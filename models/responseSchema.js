var mongoose = require('mongoose');

var responseSchema = new mongoose.Schema({
	title: String,
	date: Date,
	studyID: String,
	data: [],
	complete: Boolean,
});

responseSchema.methods.getDateStr = function() {
	var d = this.date; 
	var minutes = (d.getMinutes()<10?'0':'') + d.getMinutes();
	return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate() + " (" + d.getHours() + ":" + minutes + ")";
};

module.exports = responseSchema;