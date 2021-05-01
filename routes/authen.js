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
const dashboard = require('../model/dashboard');
var { PostFDT } = require('../model/postFDT')
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'png'],
    params: {
        folder: 'ID_Card',
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }

});

const uploadCloud = multer({ storage: storage });

/*-------------------------------------------------------------------------------*/
// server.post('/isLogin',async (req, res)=>{
//         console.log(req.body.PanjaiToken)
//         if (req.body.PanjaiToken === undefined){
//             console.log("user didn't login")
//             res.send("noLogin")
//         } else {
//             user.find({accessToken: req.body.PanjaiToken}, function(err, found){
//                 if(err){
//                     console.log(err);
//                 } else {
//                     console.log("pass")
//                     res.send("pass")
//                 }
//             })
//         }
// })
/*-------------------------------------------------------------------------------*/
server.get('/login', (req, res) => {
    user.find((err, docs) => {
        if (!err)
            res.send(docs)
        else
            console.log('Error #1 : ' + JSON.stringify(err, undefined, 2))
    })
})

server.post("/login", async function (req, res, next) {
    //console.log('username: '+req.body.username)
    //console.log('password: '+req.body.password)
    //console.log('token: '+req.body.PanjaiToken)
    user.findOne({ username: req.body.username }, await function (error, found) {
        if (error) {
            console.log(error)
        } else {
            if (found.isbaned == "yes") {
                res.send("You are baned!")
            } else {
                passport.authenticate('local', async function (err, Userdata) {
                    //console.log(Userdata)
                    if (err) {
                        console.log(err)
                        res.send(err);
                    }
                    const token = jwt.sign({ id: Userdata.username }, jwtConfig.secret);
                    //console.log("token: " + token)
                    user.findByIdAndUpdate(Userdata, { accessToken: token }, await function (error, update) {
                        if (error) {
                            console.log(error)
                            res.send(error)
                        } else {
                            const data = [token, Userdata.username, Userdata._id, Userdata.email, Userdata.address, Userdata.phone, Userdata.name, Userdata.coin]

                            //console.log(data)
                            res.send(data)
                        }
                    })
                    let result = await user.aggregate([
                        {
                            $match: {
                                "username": req.body.username
                            }
                        },
                    ])
                    const nowDay = new Date();
                    if (result[0].month !== nowDay.getMonth() + 1 || result[0].year !== nowDay.getFullYear()) {
                        user.findByIdAndUpdate(Userdata, { month: nowDay.getMonth() + 1, year: nowDay.getFullYear(), piece_available: 4 }, await function (error, update) {
                            if (error) {
                                console.log(error)
                            } else {
                                console.log("=====piece_available Update!!=====")
                            }
                        })
                    }
                    let find = await dashboard.aggregate([
                        {
                            $match: {
                                type: "numberOfUser"
                            }
                        },
                        {
                            $sort: {
                                "month": 1
                            }
                        },
                        {
                            $match: {
                                month: nowDay.getMonth() + 1
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
                })(req, res, next);
            }
        }
    })
})
// server.post('/login', function(req, res, next) {
//     console.log('username: '+ req.body.username)
//     passport.authenticate('local', function(err, user, info) {
//         if (err) { return next(err); }
//         if (!user) { return res.redirect('/login'); }
//         req.logIn(user, function(err) {
//             if (err) { return next(err); }
//             return res.redirect('/users/' + user.username);
//         });
//     })(req, res, next);
// });
/*-------------------------------------------------------------------------------*/
server.post('/logout', (req, res) => {
    //console.log("currentUser: "+req.body.currentUser_id)
    passport.authenticate('local', function (err, Userdata) {
        if (err) {
            console.log(err)
            res.send(err);
        }
        //console.log("token: " + token)
        user.findByIdAndUpdate(req.body.currentUser_id, { accessToken: null }, function (error, update) {
            if (error) {
                console.log(error)
                res.send(error)
            } else {
                //console.log(update)
                console.log("User logged out");
                res.sendStatus(200)
            }
        })
    })(req, res);
    // user.findByIdAndUpdate(_id: req.body.user_id , {accessToken: null}, function(error,update){
    //     if(error){
    //         console.log(error)
    //         res.send(err)
    //     }else{
    //         console.log(update)
    //         console.log("User logged out");
    //         res.send("User logout")
    //     }
    // })
})
/*-------------------------------------------------------------------------------*/
server.get('/register', (req, res) => {
    user.find((err, docs) => {
        if (!err)
            res.send(docs)
        else
            console.log('Error #1 : ' + JSON.stringify(err, undefined, 2))
    })
})
server.post("/register", uploadCloud.single('IDcard'), function (req, res) {
    console.log('filename: ' + req.file.filename)
    user.register(new user({ name: req.body.name, username: req.body.username, idcard: req.file.filename, email: req.body.email, address: req.body.address, phone: req.body.phone, coin: 0, accessToken: null, isbaned: "no", month: req.body.month, year: req.body.year, piece_available: 4 }), req.body.password, function (error, user) {
        if (error) {
            console.log("error: " + error);
            res.send(error)
        } else {
            console.log('user created')
            res.send(status)
        }

        passport.authenticate('local')(req, res, function () {
            //req.flash('success','Welcome to our website ,'+ user.username)
            //res.redirect('/')
        })
    })
})
server.get("/regisimage/:idcard", function (req, res) {
    res.sendFile(path.resolve(__dirname, '../public/uploads/IDcard/' + req.params.idcard))
    //http://localhost:3001/authenticate/regisimage/IDcard-1609956164208.jpg
})
/*-------------------------------------------------------------------------------*/
server.get("/banUser/:id", function (req, res) {
    console.log(req.params.id)
    user.findByIdAndUpdate(req.params.id, { isbaned: "yes" }, function (error, update) {
        if (error) {
            console.log(error)
            res.send(error)
        } else {
            //console.log(update)
            console.log("User Baned");
            res.sendStatus(200)
        }
    })
})
/*-------------------------------------------------------------------------------*/
server.get("/unBanUser/:id", function (req, res) {
    console.log(req.params.id)
    user.findByIdAndUpdate(req.params.id, { isbaned: "no" }, function (error, update) {
        if (error) {
            console.log(error)
            res.send(error)
        } else {
            //console.log(update)
            console.log("User unbaned");
            res.sendStatus(200)
        }
    })
})
/*-------------------------------------------------------------------------------*/
// server.put('/userUpdate', function (req, res) {
//     const selectid = req.body.id;
//     const newUsername = req.body.username;
//     console.log(selectid)
//     console.log(newUsername)
//     user.findByIdAndUpdate(selectid, {username:newUsername}, function(error,update){
//         if(error){
//             console.log(error)
//         }else{
//             //res.redirect('/dinsor/'+req.params.id)
//             //console.log(update)
//             res.send({_id : selectid ,username:newUsername});
//         }
//     })
// });
/*-------------------------------------------------------------------------------*/
// server.delete('/userRemove/:id', function (req, res) {
//     const selectid = req.params.id;
//     console.log(selectid)
//     user.findByIdAndDelete(selectid, function(error,remove){
//         if(error){
//             console.log(error)
//         }else{
//             //res.redirect('/dinsor/'+req.params.id)
//             //console.log(update)
//             res.send(remove);
//         }
//     })
// });
/*-------------------------------------------------------------------------------*/
server.post('/information/:id', (req, res) => {

    user.findById(req.params.id, (err, docs) => {
        if (!err) {
            //console.log(docs)
            res.send(docs)
        }
        else
            console.log('Error #1 : ' + JSON.stringify(err, undefined, 2))
    })
})
/*-------------------------------------------------------------------------------*/
server.post('/mycoin/:id', async (req, res) => {
    var newmoney = 0
    var coin2 = 0
    // console.log(req.params.id)
    // console.log(req.body.newcoin)
    // console.log(req.body.post_id)
    console.log('เงินที่มีอยู่ : ' + req.body.money)
    coin2 = req.body.coin * 2

    // for (let index = 1; index <= 12; index++) {
    //     dashboard.create({
    //         type: "donation",
    //         number: 0,
    //         month: index,
    //         year: new Date().getFullYear()
    //     })
    // }
    const wantee = new Date()
    let find = await dashboard.aggregate([
        {
            $match: {
                type: "donation"
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
    dashboard.findByIdAndUpdate(find[0]._id, { number: find[0].number + req.body.coin }, (err, docs) => {
        if (err) {
            console.log(err)
            //res.send(docs)
        }
    })

    const newData = user.findByIdAndUpdate(req.params.id, { coin: req.body.newcoin }, (err, docs) => {
        if (!err) {
            //res.send(docs)
            newmoney = req.body.money + coin2
            console.log('เงินที่ได้มา : ' + coin2)
            console.log('รวมเงิน : ' + newmoney)
            PostFDT.findByIdAndUpdate(req.body.post_id, { money: newmoney }, { new: true }, (err, docs) => {
                if (!err)
                    console.log(docs)
                //res.send(docs)
                else
                    console.log('Error #3 : ' + JSON.stringify(err, undefined, 2))
            })
        }
        else
            console.log('Error #1 : ' + JSON.stringify(err, undefined, 2))
    })

    //console.log(update._update.coin)
    res.send(newData._update)

})
/*-------------------------------------------------------------------------------*/
server.post('/getdashboard/:id', async (req, res) => {
    //console.log(req.params.id)
    const wantee = new Date()
    let check = await dashboard.aggregate([
        {
            $match: {
                type: "donation"
            }
        },
        {
            $sort: {
                "month": 1
            }
        },
    ])
    if (check[0].year !== wantee.getFullYear()) {
        dashboard.updateMany({}, { year: wantee.getFullYear(), number: 0 }, function (err) {
            if (err) {
                console.log(err)
            }
        });
    }
    let find = await dashboard.aggregate([
        {
            $match: {
                type: req.params.id
            }
        },
        {
            $sort: {
                "month": 1
            }
        },
    ])
    //console.log(find)
    const DATA = [find[0].number, find[1].number, find[2].number, find[3].number, find[4].number, find[5].number, find[6].number, find[7].number, find[8].number, find[9].number, find[10].number, find[11].number]
    //console.log(DATA)
    res.send(DATA)
})
/*-------------------------------------------------------------------------------*/
module.exports = server;