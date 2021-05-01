const   mongoose = require('mongoose')

let notiSchema = new mongoose.Schema({
    owner : String,
    requester : String,
    notification : String,
});

module.exports = mongoose.model('noti', notiSchema);