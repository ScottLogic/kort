const mongoose = require('mongoose');

var options = { discriminatorKey: 'type' };

// Define the base Event schema
const eventSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.UUID,
    type: String,
    responseId: String,
    isoTimestampSent: String,
    isoTimestampReceived: String,
}, 
options);

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
