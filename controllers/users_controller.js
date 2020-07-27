const User = require('../models/user');
const fs = require('fs');
const path = require('path');
module.exports.profile = function(request, response){
    User.findById(request.params.id, function(error, user){
        return response.render('user_profile', {
                    title: 'User Profile',
                    profile_user: user
                });
    });
}

module.exports.update = async function(request, response){
    if(request.user.id == request.params.id){
        try{
            let user = await User.findByIdAndUpdate(request.params.id);
            User.uploadedAvatar(request, response, function(error){
                if(error){
                    console.log('******* Multer Error: ', error);
                }
                user.name = request.body.name;
                user.email = request.body.email;
                if(request.file){
                    if(user.avatar){
                        if(fs.existsSync(path.join(__dirname, '..', user.avatar))){
                            fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                        }
                    }
                    user.avatar = User.avatarPath + '/' + request.file.filename;
                }
                user.save();
                return response.redirect('back');
            });
        }catch(error){
            request.flash('error ', error);
            return response.redirect('back');
        }

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