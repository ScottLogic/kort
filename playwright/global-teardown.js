import { test as teardown } from '@playwright/test';
const mongoose = require('mongoose');	
const studySchema = require('../models/studySchema.js');
const responseSchema = require('../models/responseSchema.js');
const eventSchema = require('../models/eventSchema.js');

//Here to investigate looking for event deletes

function getEvents(req){
	Study.findOne({title: req}, function (err, study) {
		if (err) {
			res.status(504);
			logger.error("treetest_server.js: Error getting study to see results:", err);
			res.end(err);
		} else {
			const studyId = 
			Response.find({_id: {$in: study.completeResponses}}, function (err, completeResponses) {
				if (err) {
					res.status(504);
					logger.error("cardsort_server.js: Error in edit cardsort:", err);
					res.end(err);
				} else {
					var responses = gatherResponses(study.data.tasks, completeResponses)
					res.render('treetest/results.ejs',{study: study,
														completeResponses:completeResponses,
														email: req.user.email,
														admin: req.session.admin,
														taskSet: responses[0],
														taskCount: responses[1]
													});
				}
			});
		}
	})

}


/**
 * Deletes all documents from the 'Study' collection.
 * @returns {Promise<Object>} - The result of the delete operation.
 */
teardown('Clean all documents', async ({ }) => {
	try {
		const conn = await mongoose.connect('mongodb://127.0.0.1:27017/kort');
		console.log('deleting test database...');
		const Study = conn.model('Study', studySchema);
		const Response = conn.model('Response', responseSchema)

		await Response.deleteMany({ $or: [ {title: 'Name'}, {title: 'Anonymous'} ] });
		await Study.deleteMany({ $or: [{title: 'Changed Title' }, {title: 'Tree Test Options Test' }, {title: 'Last Row Test' }, {title: 'Default Tree Test Title' }, {title: 'ResultPage Link Test' }, {title: 'Unique Link Test' }] });
		console.log('DELETED!');
	}
	catch (error) {
		console.error('Error deleting documents:', error);
		throw error;
	}
});
