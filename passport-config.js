var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var authModel = require('./model/user');
var JwtStrategry = require('passport-jwt').Strategy;
var extractJwt = require('passport').Stratefgy;

var option ={};
options.jwtFormRequest = ExtractJwt.formAuthHeaderAsBererToken();
options.secretOrKey = 'secret123';

passport.use(new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password'
    },
    function(username, password, done){

    }
))