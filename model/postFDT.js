const   mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');

var PostFDT = mongoose.model('PostFDT',{
    title : String,
    message : String,
    Timestamp : { type: Date, default: Date.now },
    image: Array,
    item: Array,
    n_item: Number,
    category: String,
    promptpay: String,
    endtime: Date,
    lat: Number,
    lng: Number,
    address: String,
    phone: String,
    money: Number
},'PostFDT')


module.exports = { PostFDT }