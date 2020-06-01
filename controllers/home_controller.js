const Post = require('../models/post');
const User = require('../models/user');
module.exports.home = function(request, response){
    // Populate the user of each post
    Post.find({})
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    })
    .exec(function(error, posts){
        User.find({}, function(error, users){
            return response.render('home', {
                title: "Codeial | Home",
                posts: posts,
                all_users: users
            });
        })
    });
}