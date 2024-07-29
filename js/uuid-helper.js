const { v4: uuidv4 } = require('uuid');

window.generateUUID = function() {
    return uuidv4();
};