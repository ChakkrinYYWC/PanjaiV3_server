const express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require('passport'),
    passportLocal = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    methodOverride = require('method-override'),
    cors = require('cors'),
    logger = require('morgan'),
    axios = require('axios');
path = require('path')

const PORT = process.env.PORT || 3001;

const user = require('./model/user');
var postPanjaiRoutes = require('./routes/PostPanjai')
var postFDTRoutes = require('./routes/PostFDT')
var authenticate = require('./routes/authen')
var findsomething = require('./routes/search');
var profileRoute = require('./routes/profile')
var reportRoute = require('./routes/report')
var paymentRoute = require('./routes/Payment')
const { profile } = require("console");

const app = express();

app.use(express.static(__dirname + '/public'))
app.use(cors({ origin: 'https://panjai.herokuapp.com' }))
app.use(bodyParser.json())
app.use(methodOverride("_method"));
app.use(passport.initialize())
app.use(passport.session())
app.use(require('express-session')({
    secret: 'SE101',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb+srv://Roong:rung241142@cluster0.txha8.mongodb.net/Cluster0?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true },
    err => {
        if (!err)
            console.log('Mongodb connection succeeded.')
        else
            console.log('Error while connecting MongoDB : ' + JSON.stringify(err, undefined, 2))
    });

passport.use(new passportLocal(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.get('/image/:image', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/uploads/Too-Panjai/' + req.params.image))
})
app.get('/Foundation/:image', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/uploads/Foundation/' + req.params.image))
})
app.use('/authenticate', authenticate)
app.use('/Too-Panjai', postPanjaiRoutes)
app.use('/Foundation', postFDTRoutes)
app.use('/search', findsomething)
app.use('/profile', profileRoute)
app.use('/report', reportRoute)
app.use('/pay-coin', paymentRoute)

// app.post('/signin/facebook', async (req, res) => {
//     console.log('Request -->', req.body.user)

//     try {
//       const response = await axios({
//         method: 'get',
//         url: `https://graph.facebook.com/v6.0/oauth/access_token?grant_type=fb_exchange_token&client_id=771047717101312&client_secret=94480ba4cd991ea93c6c8c87de138c03&fb_exchange_token=${req.body.user.accessToken}`
//       })

//       const result = response.data
//       console.log('Result -->', result)

//       // If (result) --> process signup (new user) / signin (exiting user)
//     } catch (error) {}
// })



// dew is hear
app.listen(PORT, function (req, res) {
    console.log('Panjai has started!');
});
