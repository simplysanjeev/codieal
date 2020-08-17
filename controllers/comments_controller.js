const Comment = require("../models/comment");
const Post = require("../models/post");
const commentMailer = require("../mailers/comments_mailer");
const queue = require("../config/kue");
const commentEmailWorker = require("../workers/comment_email_worker");
const Like = require("../models/like");
module.exports.create = async function (request, response) {
  try {
    let post = await Post.findById(request.body.post);
    if (post) {
      let comment = await Comment.create({
        content: request.body.content,
        post: request.body.post,
        user: request.user._id,
      });
      post.comments.push(comment);
      // console.log(comment);
      post.save();
      comment = comment.toJSON();
      let user = {
        _id: comment.user,
        name: request.user.name,
        email: request.user.email,
      };
      comment.user = user;
      let job = queue.create("emails", comment).save(function (error) {
        if (error) {
          console.log("Error in sending to the queue ", error);
          return;
        }
        console.log("job enqueued", job.id);
      });

      // commentMailer.newComment(comment);
      // console.log(comment);
      if (request.xhr) {
        return response.status(200).json({
          data: {
            comment: comment,
          },
          message: "You Commented on a Post!!",
        });
      }
      request.flash("success", "You Commented on a Post!");
      return response.redirect("/");
    }
  } catch (error) {
    request.flash("error", error);
    return;
  }
};

module.exports.destroy = async function (request, response) {
  try {
    let comment = await Comment.findById(request.params.id);
    if (comment.user == request.user.id) {
      let postId = comment.post;
      comment.remove();
      let post = Post.findByIdAndUpdate(postId, {
        $pull: { comments: request.params.id },
      });
      await Like.deleteMany({ likeable: comment._id, onModel: 'Comment' });
      if (request.xhr) {
        return response.status(200).json({
          data: {
            comment_id: comment._id,
          },
          message: "Comment Deleted",
        });
      }
      request.flash("success", "Comment deleted!");
      return response.redirect("back");
    } else {
      request.flash("error", "Unauthorized");
      return response.redirect("back");
    }
  } catch (error) {
    request.flash("error", error);
    return;
  }
};
