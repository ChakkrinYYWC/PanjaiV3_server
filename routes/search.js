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

//model
const user = require('../model/user');
var { PostPanjai } = require('../model/postPanjai')
var { PostFDT } = require('../model/postFDT')
var { Report } = require('../model/report')


server.get('/TPJ&FDT/:word', async (req, res) => {
    const keyword = req.params.word
    //console.log('Search: '+keyword)
    let postTPJ = await PostPanjai.aggregate([
        {
            $addFields: {
                result: {
                    $regexMatch: {
                        input: "$title",
                        regex: keyword,
                        options: "i"
                    }
                }
            }
        },
        {
            $match: {
                "result": true
            }
        },
    ])
    let postFDT = await PostFDT.aggregate([
        {
            $addFields: {
                result: {
                    $regexMatch: {
                        input: "$title",
                        regex: keyword,
                        options: "i"
                    }
                }
            }
        },
        {
            $match: {
                "result": true
            }
        },
    ])



    const result = { postTPJ, postFDT }
    //console.log(result)
    res.send(result)
})

server.get('/findUser/:word', async (req, res) => {
    const keyword = req.params.word
    //console.log('Search: '+keyword)
    let result = await user.aggregate([
        {
            $match: {
                "isbaned": "no"
            }
        },
        {
            $addFields: {
                result: {
                    $regexMatch: {
                        input: "$username",
                        regex: keyword,
                        options: "i"
                    }
                }
            }
        },
        {
            $match: {
                "result": true
            }
        },
    ])
    //console.log(result)
    res.send(result)
})

server.get('/findBanedUser', async (req, res) => {
    const keyword = req.params.word
    //console.log('Search: '+keyword)
    let result = await user.aggregate([
        {
            $match: {
                "isbaned": "yes"
            }
        },
    ])
    //console.log(result)
    res.send(result)
})

server.get('/postreport', async (req, res) => {
    let result = await Report.aggregate([
        {
            $lookup:
            {
                localField: "post_id",
                from: "PostPanjai",
                foreignField: "_id",
                as: "post"
            }
        },
        {
            $unwind: "$post"
        },
        {
            $project: {
                "_id": 0,
            }
        },
    ])
    //console.log(result)
    res.send(result)
})

// server.post('/getPieceAvailable/:id', async (req, res) => {
//     //console.log("UID" + req.params.id)
//     let result = await user.aggregate([
//         {
//             $match: {
//                 _id: mongoose.Types.ObjectId(req.params.id)
//             }
//         },
//     ])
//     //console.log(result[0].piece_available)
//     res.send(result[0].piece_available)
// })

module.exports = server;