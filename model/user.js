const mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

let userSchema = new mongoose.Schema({
    name: String,
    username: String,
    idcard: String,
    email: String,
    address: String,
    phone: String,
    accessToken: String,
    coin: Number,
    isbaned: String,
    month: Number,
    year: Number,
    piece_available: Number,
    favorite: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "postPanjai"
    },
    request: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "postPanjai"
    },
    // notification : {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "postPanjai",
    // },
    recieve: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "postPanjai"
    },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', userSchema);