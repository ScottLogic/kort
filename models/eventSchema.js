var mongoose = require('mongoose');

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

module.exports = eventSchema;