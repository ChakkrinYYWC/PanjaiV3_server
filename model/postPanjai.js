const   mongoose = require('mongoose')

var PostPanjai = mongoose.model('PostPanjai',{
    title : String,
    message : String,
    Timestamp : { type: Date, default: Date.now },
    image: Array,
    contect: String,
    location:String,
    creator: String,
},'PostPanjai')

// hi bro
module.exports = { PostPanjai }