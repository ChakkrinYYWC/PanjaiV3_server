const express = require('express')
var router = express.Router()
var ObjectID = require('mongoose').Types.ObjectId
const fs = require('fs')
const multer = require('multer')
const path = require('path')
const mongoose = require("mongoose");

var { PostPanjai } = require('../model/postPanjai')
const user = require('../model/user');
const noti = require('../model/notification');
const recieve = require('../model/recieve');
const cloudinary = require('./cloudinary');
const dashboard = require('../model/dashboard')
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'png'],
    params: {
        folder: 'Too-Panjai',
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }

});

const uploadCloud = multer({ storage: storage });

router.get('/', (req, res) => {
    PostPanjai.find({}, (err, docs) => {
        if (!err)
            res.send(docs)
        else
            console.log('Error #1 : ' + JSON.stringify(err, undefined, 2))
    })
})

router.post('/', uploadCloud.array('image'), (req, res) => {

    console.log('***')

    const urls = []
    req.files.forEach(file => urls.push(file.path))

    var newRecord = new PostPanjai({
        title: req.body.title,
        message: req.body.message,
        contect: req.body.contect,
        location: req.body.location,
        image: urls,
        creator: req.body.creator
    })
    console.log(newRecord)
    newRecord.save((err, docs) => {
        if (!err)
            res.send(docs)
        else
            console.log('Error #2 : ' + JSON.stringify(err, undefined, 2))
    })
})

router.put('/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('No record with given id : ' + req.params.id)

    var updatedRecord = {
        title: req.body.title,
        message: req.body.message,
        contect: req.body.contect,
        location: req.body.location
    }

    PostPanjai.findByIdAndUpdate(req.params.id, { $set: updatedRecord }, { new: true }, (err, docs) => {
        if (!err)
            res.send(docs)
        else
            console.log('Error #3 : ' + JSON.stringify(err, undefined, 2))
    })
})

router.delete('/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('No #4 : ' + req.params.id)

    PostPanjai.findByIdAndRemove(req.params.id, (err, docs) => {
        if (!err)
            res.send(docs)
        else
            console.log('Error #5 : ' + JSON.stringify(err, undefined, 2))
    })
})

router.post('/addFav/:id', (req, res) => {
    console.log("Post_id: " + req.params.id)
    console.log("currentuser_id: " + req.body.currentUser_id)

    user.findByIdAndUpdate(req.body.currentUser_id, { $addToSet: { favorite: req.params.id } }, function (error, update) {
        if (error) {
            console.log(error)
        }
    })
})

router.post('/addRequest/:id', async function (req, res) {
    console.log("Post_id: " + req.params.id)
    console.log("currentuser_id: " + req.body.currentUser_id)

    // const Post = PostPanjai.findById(req.params.id,await function(error,done){
    //     if(error){
    //         console.log(error)
    //     }else{
    //         //console.log(done)
    //     }
    // })
    let post = await PostPanjai.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(req.params.id)
            }
        },
    ])
    let owner_id = await user.aggregate([
        {
            $match: {
                username: post[0].creator
            }
        },
    ])
    let requester = await user.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(req.body.currentUser_id)
            }
        },
    ])
    console.log(owner_id)
    if (requester[0].piece_available >= 1) {
        user.findByIdAndUpdate(req.body.currentUser_id, { $addToSet: { request: req.params.id } }, await function (error, update) {
            if (error) {
                console.log(error)
            }
        })
        noti.create({
            owner: owner_id[0].username,
            requester: req.body.currentUser,
            notification: post[0].title,
        })
    } else {
        res.send("You are out of quota limit")
    }

})

router.post('/notifications/:id', async function (req, res) {
    //console.log("Id:"+req.params.id)
    let find = await user.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(req.params.id)
            }
        }
    ])
    let result = await noti.aggregate([
        {
            $match: {
                "owner": find[0].username
            }
        }
    ])
    res.send(result)
})

router.post('/recieveAccept', async function (req, res) {
    let owner = await user.aggregate([
        {
            $match: {
                username: req.body.username
            }
        },
    ])
    let requester = await user.aggregate([
        {
            $match: {
                username: req.body.sendTo
            }
        },
    ])
    console.log(requester[0].piece_available)
    if (requester[0].piece_available >= 1) {
        recieve.create({
            to: req.body.sendTo,
            owner: owner[0].username,
            owner_contact: owner[0].phone,
            item: req.body.item,
        })
        //recieve.index({ "createdAt": 1 }, { expireAfterSeconds: 10 })
        //recieve.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 10 })
        // db.log_events.createIndex( { "expireAt": 1 }, { expireAfterSeconds: 0 } )
        // db.log_events.insert( {
        //     "createdAt": new Date(), 
        //     "logEvent": 2, 
        //     "logMessage": "Success!"
        // } )
        // db.log_events.createIndex( { "createdAt": 1 }, { expireAfterSeconds: 3600 } )
        user.findByIdAndUpdate(requester[0]._id, { piece_available: requester[0].piece_available - 1 }, await function (error, update) {
            if (error) {
                console.log(error)
            } else {
                console.log("=====piece_available decrease!!=====")
            }
        })
        const wantee = new Date()
        let find = await dashboard.aggregate([
            {
                $match: {
                    type: "numberOfDonation"
                }
            },
            {
                $sort: {
                    "month": 1
                }
            },
            {
                $match: {
                    month: wantee.getMonth() + 1
                }
            },
        ])
        //console.log(find)
        dashboard.findByIdAndUpdate(find[0]._id, { number: find[0].number + 1 }, (err, docs) => {
            if (err) {
                console.log(err)
                //res.send(docs)
            }
        })
        res.sendStatus(200)
    } else {
        res.send(req.body.sendTo + " was out of quota limit")
    }
    //console.log(owner_id)
    // recieve.createIndex( { "createdAt": 1 }, { expireAfterSeconds: 3600 } )

    noti.findByIdAndDelete(req.body.notiId, function (error, remove) {
        if (error) {
            console.log(error)
        }
    })
})

router.post('/recieveDeny', async function (req, res) {
    noti.findByIdAndDelete(req.body.notiId, function (error, remove) {
        if (error) {
            console.log(error)
        } else {
            res.sendStatus(200)
        }
    })
})

router.post('/deleteRecieve', async function (req, res) {
    console.log("12345")
    await recieve.findByIdAndDelete(req.body.recieveId, function (error, remove) {
        if (error) {
            console.log(error)
        }
    })
    res.status(200).send("ok")
})

router.post('/findRecieve/:id', async function (req, res) {
    //console.log("Id:"+req.params.id)
    let find = await user.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(req.params.id)
            }
        }
    ])
    let result = await recieve.aggregate([
        {
            $match: {
                "to": find[0].username
            }
        }
    ])

    res.send(result)
})

module.exports = router