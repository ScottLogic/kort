import { test as teardown } from '@playwright/test';
const mongoose = require('mongoose');	
const studySchema = require('../models/studySchema.js');
const responseSchema = require('../models/responseSchema.js');
const eventSchema = require('../models/eventSchema.js');

/**
 * Deletes all documents from the 'Study' collection.
 * @returns {Promise<Object>} - The result of the delete operation.
 */
teardown('Clean all documents', async ({ }) => {
	try {
		const conn = await mongoose.connect('mongodb://127.0.0.1:27017/kort');
		console.log('deleting test database...');
		const Study = conn.model('Study', studySchema);
		const Response = conn.model('Response', responseSchema);

		getEvents('Response Tree Test ' , Study, Response);
		await Response.deleteMany({ $or: [ {title: 'Name'}, {title: 'Anonymous'} ] });
		await Study.deleteMany({ $or: [{title: 'Changed Title' }, {title: 'Tree Test Options Test' }, {title: 'Last Row Test' }, {title: 'Default Tree Test Title' }, {title: 'ResultPage Link Test' }, {title: 'Unique Link Test' }] });
		console.log('DELETED!');
	}
	catch (error) {
		console.error('Error deleting documents:', error);
		throw error;
	}
});

//Gets StudyID and finds study with that id, Then gets reponseID for that studyID and THEN gets events with that responseID (currently broken as studyID is not being passed properly into the response.FindOne())
function getEvents(studyTitle, Study, Response){
	Study.findOne({title: studyTitle}, function (err, study) {

		var studyIdVar = JSON.stringify(study._id);
		console.log('STUDY ID: ' + studyIdVar);

		Response.findOne({studyID: studyIdVar}, function (err, response) {
			const responseIdVar = JSON.stringify(response._id)
			console.log('RESPONSE ID: ' + responseIdVar);
		});
	});
}