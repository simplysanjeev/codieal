module.exports.home = function(request, response){
    console.log(request.cookies);
    response.cookie('user_id', 25);
    return response.render('home', {
        title: "Home"
    });
}