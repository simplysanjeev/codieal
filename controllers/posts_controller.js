const Post = require("../models/post");
const Comment = require("../models/comment");
// const User = require("../models/user");
const Like = require("../models/like");
module.exports.create = async function (request, response) {
  try {
    let post = await Post.create({
      content: request.body.content,
      user: request.user._id,
    });
    post = post.toJSON();
    //let user = await User.find({_id: post.user});
    post.user_name = request.user.name;
    if (request.xhr) {
      return response.status(200).json({
        data: {
          post: post,
        },
        message: "Post Created",
      });
    }
    request.flash("success", "Post published!!");
    return response.redirect("back");
  } catch (error) {
    request.flash("error", error);
    return response.redirect("back");
  }
};

module.exports.destroy = async function (request, response) {
  try {
    let post = await Post.findById(request.params.id);
    //.id means converting the object id into string
    if (post.user == request.user.id) {
      await Like.deleteMany({ likeable: post, onModel: 'Post' });
      await Like.deleteMany({ _id: { $in: post.comments } });

      post.remove();
      await Comment.deleteMany({ post: request.params.id });
      if (request.xhr) {
        return response.status(200).json({
          data: {
            post_id: request.params.id,
          },
          message: "Post Deleted",
        });
      }
      request.flash("success", "Post and Associated comments deleted!");
      return response.redirect("back");
    } else {
      request.flash("error", "You cannot delete this post!");
      return response.redirect("back");
    }
  } catch (error) {
    request.flash("error", error);
    return response.redirect("back");
  }
};
