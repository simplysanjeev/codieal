const User = require('../models/user');

module.exports.profile = function(request, response){
    User.findById(request.params.id, function(error, user){
        return response.render('user_profile', {
                    title: 'User Profile',
                    profile_user: user
                });
    });
}

module.exports.update = function(request, response){
    if(request.user.id == request.params.id){
        User.findByIdAndUpdate(request.params.id, request.body, function(error, user){
            return response.redirect('back');
        });
    }else{
        request.flash('error', 'Unauthorised!');
        return response.status(401).send('Unauthorised');
    }
}



//render the sign up page
module.exports.signUp = function(request, response){
    if(request.isAuthenticated()){
        return response.redirect('/users/profile');
    }

    return response.render('user_sign_up', {
        title : "Codeial | Sign Up"
    });
}

//render the sign in page
module.exports.signIn = function(request, response){
    if(request.isAuthenticated()){
        return response.redirect('/users/profile');
    }

    return response.render('user_sign_in', {
        title : "Codeial | Sign In"
    });
}

//get the sign up data
module.exports.create = async function(request, response){
    if(request.body.password !== request.body.confirm_password){
        request.flash('error', 'Passwords do not match');
        return response.redirect('back');
    }

    try{
        let user = await User.findOne({email: request.body.email});
        if(!user){
            await User.create(request.body);
            return  response.redirect('/users/sign-in');  
        }else{
            request.flash('success', 'You have signed up, login to continue!');
            return response.redirect('back');
        }
    }catch(error){
        request.flash('error', error);
    }

}

//sign in and create a session for the user
module.exports.createSession = function(request, response){
    //TODO later
    request.flash('success', 'Logged in Successfully');
    return response.redirect('/');
}

module.exports.destroySession = function(request, response){
    request.logout();
    request.flash('success', 'You have Logged Out!!');
    return response.redirect('/');  
}