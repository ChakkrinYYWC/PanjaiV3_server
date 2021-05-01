const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require('passport');
const methodOverride = require('method-override');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

const server = express.Router();

//export files
const middleware = require('../middleware/mdw');
const jwtConfig = require("../config/jwtConfig");

//model
const user = require('../model/user');
var { PostPanjai } = require('../model/postPanjai')
var { PostFDT } = require('../model/postFDT');
const e = require("express");

/*-------------------------------------------------------------------------------*/
server.post('/favorite/:user',async function(req, res){
    console.log("User: " + req.params.user)
    // const result = await user.findById(req.params.user, function(error,done){
    //     if (error) {
    //         console.log(error)
    //     } else {
    //         console.log(done)
    //     }
    // })
    let result = await user.aggregate([
        {
            $match: {
                _id : mongoose.Types.ObjectId(req.params.user)
            }
        },
        {
            $lookup:
            {
                localField: "favorite",
                from: "PostPanjai",
                foreignField: "_id",
                as: "favorite"
            }
        },
    ])
    console.log(result[0].favorite)
    res.send(result[0].favorite)
})

server.post('/update/:id', function (req, res) {

    var updatedUser = {
        phone: req.body[0],
        address: req.body[1],
        name: req.body[2],
    }

    user.findByIdAndUpdate(req.params.id, { $set: updatedUser }, { new: true }, function(error,update){
        if(!error){
            res.send(update)
        }else{
            console.log('Error #3 : '+error)
        }
    })

});

server.get('/', (req, res) => {
    console.log('*')
    user.find({}, (err, docs) => {
        if (!err)
            res.send(docs)
        else
            console.log('Error #1 : ' + JSON.stringify(err, undefined, 2))
    })
})

server.put('/:id', (req, res) => {

    var updatedRecord = {
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
    }

    user.findByIdAndUpdate(req.params.id, { $set: updatedRecord }, { new: true }, function(error,update){
        if(!error){
            res.send(update)
        }else{
            console.log('Error #3 : '+error)
        }
    })
})

server.get('/userInformation/:id',async function (req, res) {
    //console.log(req.params.id)
    let result = await user.aggregate([
        {
            $match: {
                _id : mongoose.Types.ObjectId(req.params.id)
            }
        },
    ])
    // console.log(result)
    res.send(result[0])

});

server.get('/postInformation/:user',async function (req, res) {
    //console.log(req.params.user)
    let result = await PostPanjai.aggregate([
        {
            $match: {
                creator : req.params.user
            }
        },
    ])
    //console.log(result)
    res.send(result)

});
/*-------------------------------------------------------------------------------*/
module.exports = server;