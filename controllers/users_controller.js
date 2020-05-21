module.exports.profile = function(request, response){
    response.render('user_profile', {
        title: 'user profile'
    });
}