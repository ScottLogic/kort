const { v4: uuidv4 } = require('uuid');

function generateUUID() {
    return uuidv4();
}

if (typeof window !== 'undefined') {
    window.generateUUID = generateUUID;
}

module.exports = generateUUID;