const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

passport.use(new googleStrategy({
    clientID: "470268764098-7jpg81l7o9kh721f449k734607ufg5i4.apps.googleusercontent.com",
    clientSecret: "8EzQA1TJwBj5aClkM2yhFJBu",
    callbackURL: "http://localhost:8000/users/auth/google/callback"
}, function(accessToken, refreshToken, profile, done){
    //find a user
    User.findOne({email: profile.emails[0].value}).exec(function(error, user){
        if(error){console.log('error in google strategy-passport', error); return;}
        console.log(profile);
        if(user){
            //If found, set the user as request.user
            return done(null, user);
        }else{
            //If not found, create the user and set it as request.user
            User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            }, function(error, user){
                if(error){console.log('error in creating user using google passport-strategy'); return;}
                return done(null, user);
            });
        }
    });
}
));

module.exports = passport;