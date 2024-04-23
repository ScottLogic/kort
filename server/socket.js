const { Server } = require('socket.io');
const Event = require('mongoose').model('Event');
const logger = require('./logger.js');

function setupSocketServer(httpServer) {
	const server = new Server(httpServer);

	server.on('connect', (socket) => {
		logger.info(`Socket connected: ${socket.id}`);
		socket.on('disconnect', (reason) => {
			logger.info(`Socket disconnected: ${socket.id}. Reason: ${reason}`);
		});

		socket.on('page load', saveEventToDb('page load'));
		socket.on('activate node', saveEventToDb('activate node'));
		socket.on('open node', saveEventToDb('open node'));
		socket.on('close node', saveEventToDb('close node'));
		socket.on('task changed', saveEventToDb('task changed'));
		socket.on('submit response', saveEventToDb('submit response'));
		socket.on('window visibility changed', saveEventToDb('window visibility changed'));
	});
}

function saveEventToDb(eventType) {
	return function(eventJson) {
		const data = JSON.parse(eventJson);
		const isoTimestampReceived = new Date().toISOString();

		Event.findOne({ _id: data.id }, (err, event) => {
			if (err) {
				const errString = typeof(err) === 'string' ? err : JSON.stringify(err);
				logger.error(`server/socket.js: error finding Event: ${errString}`);
				return;
			}

			if (event) {
				// If the same event gets re-posted, don't overwrite it
				return;
			}

			const eventInDb = new Event();
			eventInDb._id = extract(data, 'id');
			eventInDb.type = eventType;
			eventInDb.isoTimestampSent = extract(data, 'timestamp');
			eventInDb.isoTimestampReceived = isoTimestampReceived;
			eventInDb.responseId = extract(data, 'responseId');
			eventInDb.data = data;

			eventInDb.save((err) => {
				if (err) {
					const errString = typeof(err) === 'string' ? err : JSON.stringify(err);
					logger.error(`server/socket.js: error saving Event: ${errString}`);
					throw err;
				}

				logger.info(`Saved Event to database: ${eventInDb.id}`);
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
