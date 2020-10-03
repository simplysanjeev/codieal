const Post = require("../models/post");
const User = require("../models/user");
module.exports.home = async function (request, response) {
  try {
    // Populate the user of each post
    let posts = await Post.find({})
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
        populate: {
          path: "likes",
        },
        options: {
          sort: "-createdAt",
        },
      })
      .populate("likes");
    let friendList = new Set();
    for (friend of request.user.friendships) {
      friendList.add(friend);
    }
    let users = await User.find({});
    console.log(friendList);
    return response.render("home", {
      title: "Codeial | Home",
      posts: posts,
      all_users: users,
      friend_list: friendList
    });
  } catch (error) {
    console.log(`Error: ${error}`);
    return;
  }
}