module.exports.post = function(request, response){
    return response.end('<h1>User Post</h1>');
}

module.exports.deletePost = function(request, response){
    return response.end('<h1>Post Deleted</h1>');
}