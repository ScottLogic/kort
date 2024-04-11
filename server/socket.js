const { Server } = require('socket.io');
const Event = require('mongoose').model('Event');
const logger = require('./logger.js');

function setupSocketServer(httpServer) {
	const socketIo = new Server(httpServer);

	socketIo.on('connect', (socket) => {
		logger.info('Socket connected: ' + socket.id);
		socket.on('disconnect', () => {
			logger.info('Socket disconnected: ' + socket.id);
		});
	});
}

function saveEventToDb(eventType) {
	return function(eventJson) {
		const data = JSON.parse(eventJson);
		const isoTimestampReceived = new Date().toISOString();

		Event.findOne({ id: data.id }, (err, event) => {
			if (err) {
				logger.error('server/socket.js: error finding Event:', err);
				return;
			}

			if (event) {
				// If the same event gets re-posted, don't overwrite it
				return;
			}

			const eventInDb = new Event();
			eventInDb.id = extract(data, 'id');
			eventInDb.type = eventType;
			eventInDb.iso_timestamp_sent = extract(data, 'timestamp');
			eventInDb.iso_timestamp_received = isoTimestampReceived;
			eventInDb.tree_test_id = extract(data, 'tree_test_id');
			eventInDb.data = data;

			eventInDb.save((err) => {
				if (err) {
					logger.error('server/socket.js: error saving Event:', err);
					throw err;
				}

				logger.info('Saved Event to database:', eventInDb.id);
			});
		});
	};
}

function extract(object, property) {
	const value = object[property];
	delete object[property];
	return value;
}

module.exports = { setupSocketServer };
