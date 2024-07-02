var mongoose = require('mongoose');

var studySchema = new mongoose.Schema({
	title: String,
	type: String,
	dateCreated: Date,
	completeResponses: [],
	incompleteResponses: [],
	status: {
		type: String,
		enum: ['open', 'closed'],
	},
	ownerID: String,
	sharedUserIDs: [],
	data: {},
	private: Boolean,
});

studySchema.methods.getAllResponses = function() {
  return this.completeResponses.concat(this.incompleteResponses);
};

studySchema.methods.getDateStr = function() {
	var d = this._id.getTimestamp(); 
	var minutes = (d.getMinutes()<10?'0':'') + d.getMinutes();
	return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate() + " (" + d.getHours() + ":" + minutes + ")";
};

module.exports = studySchema;