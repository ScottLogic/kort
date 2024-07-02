const mongoose = require('mongoose');
const eventSchema = require('./eventSchema.js');

var options = { discriminatorKey: 'type' };

const Event = mongoose.model('Event', eventSchema);

// Define a common schema for node-related event
const nodeActionEventSchema = new mongoose.Schema({
	taskIndex: Number,
    node: [String],
}, 
options);

['select_node', 'open_node', 'close_node'].forEach(eventType => {
    Event.discriminator(eventType, nodeActionEventSchema);
});

// Define a schema for window visibility changed event
const windowVisibilityChangedEventSchema = new mongoose.Schema({
    visible: Boolean
}, 
options);

Event.discriminator('window_visibility_changed', windowVisibilityChangedEventSchema);

module.exports = Event;
