var mongoose = require('mongoose');  
const responseSchema = require('./responseSchema.js');

module.exports = mongoose.model('Response', responseSchema);
