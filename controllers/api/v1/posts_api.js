const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(request, response){
    let posts = await Post.find({})
                .sort('-createdAt')
                .populate('user')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'user'
                    }
                });

    return response.json(200, {
        message: "List of Posts",
        posts: posts
    });
}

module.exports.destroy = async function(request, response){
    try{
        let post = await Post.findById(request.params.id);
        if(post.user.toString() === request.user.id.toString()){
            post.remove();
            await Comment.deleteMany({post: request.params.id});
            return response.json(200, {
                message: "Post and Associated Comments deleted"
            });
        }else{
            return response.json(401, {
                message: "You cannot delete this post!"
            });
        }


    }catch(error){
        console.log('********', error);
        return response.json(500, {
            message: "Internal Server Error"
        });
    }
}