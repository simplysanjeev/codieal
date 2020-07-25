const Comment = require('../models/comment');
const Post = require('../models/post');
module.exports.create = async function(request, response){
    try{
        let post = await Post.findById(request.body.post);
            if(post){
                let comment = await Comment.create({
                    content: request.body.content,
                    post: request.body.post,
                    user: request.user._id
                });
                post.comments.push(comment);
                // console.log(comment);
                post.save();
                comment = comment.toJSON();
                comment.user_name = request.user.name;
                if(request.xhr){
                    return response.status(200).json({
                        data : {
                            comment: comment
                        },
                        message: "You Commented on a Post!!"
                    });
                }
                request.flash('success', 'You Commented on a Post!');
                return response.redirect('/');
            }
    }catch(error){
        request.flash('error', error);
        return;
    }
}

module.exports.destroy = async function(request, response){
    try{
        let comment = await Comment.findById(request.params.id);
        if(comment.user == request.user.id){
            let postId = comment.post;
            comment.remove();
            let post = Post.findByIdAndUpdate(postId, {$pull : {comments : request.params.id}});
            if(request.xhr){
                return response.status(200).json({
                    data : {
                        comment_id: comment._id
                    },
                    message: "Comment Deleted"
                });
            }
            request.flash('success', 'Comment deleted!');
            return response.redirect('back');
        }else{
            request.flash('error', 'Unauthorized');
            return response.redirect('back');
        }

    }catch(error){
        request.flash('error', error);
        return ;
    }
}