const mongoose = require('mongoose')

let dashboardSchema = new mongoose.Schema({
    type: String,
    number: Number,
    month: Number,
    year: Number,
});

module.exports = mongoose.model('dashboard', dashboardSchema);