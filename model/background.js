const   mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');

var background = mongoose.model('background',{
    name: String,
    image: String
},'background')


module.exports = { background }