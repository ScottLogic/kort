import { test as teardown } from '@playwright/test';
const Study = require('../models/study.js');
const mongoose = require('mongoose');

/**
 * Deletes all documents from the 'Study' collection.
 * @returns {Promise<Object>} - The result of the delete operation.
 */
teardown('Clean all documents', async ({ }) => {
	// await mongoose.connect('mongodb://localhost:27017/kort').then(m => {try {
	// 	console.log('deleting test database...');
	// 	const result = Study.deleteMany({ type: 'treetest' });
	// 	console.log('DELETED!');
	// 	return result;
	// }
	// catch (error) {
	// 	console.error('Error deleting documents:', error);
	// 	throw error;
	// }});

	try {
		await mongoose.connect('mongodb://127.0.0.1:27017/kort');
		console.log('deleting test database...');
		const result = await Study.deleteMany({ type: 'treetest' });
		console.log('DELETED!');
		return result;
	}
	catch (error) {
		console.error('Error deleting documents:', error);
		throw error;
	}
});
