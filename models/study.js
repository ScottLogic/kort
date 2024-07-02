var mongoose = require('mongoose');  
const studySchema = require('./studySchema.js');

module.exports = mongoose.model('Study', studySchema);