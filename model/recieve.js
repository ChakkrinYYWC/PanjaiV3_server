const mongoose = require('mongoose')

let recieveSchema = new mongoose.Schema({
    to: String,
    owner: String,
    owner_contact: String,
    item: String,
    createdAt: { type: Date, expires: '168h', default: Date.now },
    logEvent: Number,
    logMessage: String,
});

module.exports = mongoose.model('recieve', recieveSchema);