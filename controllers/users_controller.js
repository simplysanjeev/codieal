const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const resetPasswordMailer = require('../mailers/reset_password_mailer'); 
const ResetPasswordTokenCollection = require('../models/resetPasswordToken');
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
module.exports.resetPasswordFormRedirect = function(request, response){
    response.render('reset_password_form',{title:'Reset Password'});
}
module.exports.resetPasswordMailGenerator = async function(request, response){
    //TODO create reset password token document
    try{
        let email = request.body.email;
        let user = await User.findOne({email:email});
        
        if(user){
            let accesstoken = crypto.randomBytes(50).toString('hex');
            let token = await ResetPasswordTokenCollection.create({
                user: user._id,
                accesstoken: accesstoken,
                isValid: true
            });
            token = await ResetPasswordTokenCollection.findById(token._id).populate('user');
            resetPasswordMailer.resetPassword(token);
            return response.render('check_email', {title: "Reset Password | Codeial", email: token.user.email});
        }else{
            request.flash('error', 'Invalid Email Id');
            return response.redirect('back');
        }
    }catch(error){
        console.log('Error ', error);
        return response.redirect('back');
    }
    //TODo Store it in reset Password token inside resetPasswordToken collection
    //TODO send mail to reset password with token
}

module.exports.changePasswordFormRedirect = async function(request, response){
    //TODO check if new password == confirm new password
    //TODO check reset password token recieved through the request
    //TODO token matches set isValid false
    console.log(request.query.accesstoken);
    let token = await ResetPasswordTokenCollection.findOne({accesstoken: request.query.accesstoken}).populate('user');
    if(token && token.isValid == true){
        return response.render('enter_new_password', {title: 'Change Password', accesstoken : token.accesstoken, email: token.user.email});
    }else{
        response.flash('error', 'Invalid Token');
        return response.redirect('/');
    }
}

module.exports.enterNewPasswordForm = async function(request, response){
    // console.log(request.body.password, request.body["confirm-password"]);
    if(request.body.password != request.body["confirm-password"]){
        request.flash('error', 'Password didnot matched!!');
        return response.redirect('back');
    }else{
        let token = await ResetPasswordTokenCollection.findOne({accesstoken: request.body.accesstoken}).populate('user');
        // console.log(token);
        if(token && token.isValid == true){
            token = await ResetPasswordTokenCollection.findByIdAndUpdate(token._id, {isValid: false});
            let user = await User.findByIdAndUpdate(token.user._id, {password: request.body.password});
            request.flash('success', 'Password Changed. Redirecting to Sign In Page');
            return response.render('user_sign_in', {title:"Codeial | Sign In"});
        }else{
            request.flash('error', 'Access Token is Invalid!!');
            return response.render('user_sign_in', {title:"Codeial | Sign In"});
        }
    }
}