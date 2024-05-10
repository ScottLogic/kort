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

		socket.on('page_load', saveEventToDb());
		socket.on('select_node', saveEventToDb());
		socket.on('open_node', saveEventToDb());
		socket.on('close_node', saveEventToDb());
		socket.on('task_changed', saveEventToDb());
		socket.on('give_up', saveEventToDb());
		socket.on('tree_test_completed', saveEventToDb());
		socket.on('window_visibility_changed', saveEventToDb());
	});
}

function saveEventToDb() {
	return function(eventJson) {
		const data = JSON.parse(eventJson);
		const isoTimestampReceived = new Date().toISOString();

		Event.findById(data._id, (err, event) => {
			if (err) {
				const errString = typeof(err) === 'string' ? err : JSON.stringify(err);
				logger.error(`server/socket.js: error finding Event: ${errString}`);
				return;
			}

			if (event) {
				// If the same event gets re-posted, don't overwrite it
				return;
			}

			const eventInDb = new Event({
				...data,
				isoTimestampReceived,
			});

			eventInDb.save((err) => {
				if (err) {
					const errString = typeof(err) === 'string' ? err : JSON.stringify(err);
					logger.error(`server/socket.js: error saving Event: ${errString}`);
					throw err;
				}

				logger.info(`Saved Event to database: ${eventInDb._id}`);
			});
		});
	};
}

module.exports = { setupSocketServer };
