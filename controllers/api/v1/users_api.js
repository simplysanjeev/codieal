const User = require('../../../models/user');
const jwt = require('jsonwebtoken');

module.exports.createSession = async function(request, response){
    try{
        let user = await User.findOne({email: request.body.email});
        console.log(user);
        if(!user || user.password != request.body.password){
            return response.json(422, {
                message: "Invalid Username or Password"
            });
        }
        return response.json(200, {
            message: 'Sign in successful, here is your token, please keep it safe!',
            data:{
                token: jwt.sign(user.toJSON(), 'codeial', {expiresIn:'100000000'})
            }
        });
    }catch(error){
        console.log('*********', error);
        return response.json(500, {
            message: "Internal Server Error"
        });
    }
}