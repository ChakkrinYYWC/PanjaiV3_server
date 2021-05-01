const express = require('express');
var router = express.Router()
require('dotenv').config()

const user = require('../model/user');

const omise = require("omise")({
    publicKey: "pkey_test_5nn9vxnb3wo98dt5k6m",
    secretKey: "skey_test_5nn9vxnb1lewl3oix28"
});

// const omise = require("omise")({    
//     publicKey: process.env.OMISE_PUBLIC_KEY,
//     secretKey: process.env.OMISE_SECRET_KEY
// });

//console.log(process.env.OMISE_PUBLIC_KEY)

router.post('/', async (req, res, next) => {
    // console.log(req.body.user_id)
    console.log(req.body.my_coin)
    var coin = 0
    const { email, name, amount, token, user_id, my_coin } = req.body
    if (amount == 2000) {
        coin = my_coin + 10;

    } else if (amount == 5000) {
        coin = my_coin + 25;

    } else if (amount == 10000) {
        coin = my_coin + 50;

    } else if (amount == 15000) {
        coin = my_coin + 75;

    } else if (amount == 20000) {
        coin = my_coin + 100;

    } else if (amount == 50000) {
        coin = my_coin + 250;

    } else if (amount == 100000) {
        coin = my_coin + 500;

    }
    console.log('**')
    console.log(coin)

    try {
        const customer = await omise.customers.create({
            email,
            description: name,
            card: token,
        });

        const charge = await omise.charges.create({
            amount,
            currency: 'THB',
            customer: customer.id
        });

        //console.log(charge)
        user.findByIdAndUpdate(user_id, { $set: { coin: coin } }, (error, update) => {
            if (!error) {
                //console.log(update.coin)
            } else {
                console.log(error)
            }
        })

        res.send({
            coin,
            user_id,
            amount: charge.amount,
            status: charge.status
        })
    } catch (error) {
        console.log(error)
    }

    next()
})

module.exports = router