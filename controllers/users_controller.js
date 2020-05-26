const User = require('../models/user');

module.exports.profile = function(request, response){
    response.render('user_profile', {
        title: 'user profile'
    });
}

//render the sign up page
module.exports.signUp = function(request, response){
    return response.render('user_sign_up', {
        title : "Codeial | Sign Up"
    });
}

//render the sign in page
module.exports.signIn = function(request, response){
    return response.render('user_sign_in', {
        title : "Codeial | Sign In"
    });
}

//get the sign up data
module.exports.create = function(request, response){
    if(request.body.password !== request.body.confirm_password){
        return response.redirect('back');
    }
    console.log("Searching for password");
    User.findOne({email: request.body.email}, function(error, user){
        if(error){
            console.log('error in finding user in signing up');
            return;
        }
        if(!user){
            User.create(request.body, function(error, user){
                if(error){console.log('error in finding user in signing up');return;}
                return  response.redirect('/users/sign-in');  
            });
        }else{
            console.log("User found");
            return response.redirect('back');
        }
    });
}

//sign in and create a session for the user
module.exports.createSession = function(request, response){
    //TODO later
}