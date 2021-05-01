const   mongoose = require('mongoose')

var Report = mongoose.model('Report',{
    from: String, 
    user_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    post_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "postPanjai"
    },
},'Report')

module.exports = { Report }