const Friendship = require('../models/friendship');
const User = require('../models/user');
module.exports.toggleFreindship = async function (request, response) {
    try {
        let friendship;
        //check if friendship exist
        let requestSender = await User.findById(request.user._id).populate('friendship');
        let requestReceiver = await User.findById(request.query.user_id).populate('friendship');
        if (requestSender.friendships.includes(request.query.user_id)) {
            requestSender.friendships.pull(request.query.user_id);
            requestReceiver.friendships.pull(request.user._id);
            requestSender.save();
            requestReceiver.save();
            let newFriendship = await Friendship.create({
                from_user: request.user._id,
                to_user: request.query.user_id
            });
            friendship = false;
        } else {
            console.log('not friends');
            friendship = true;
        }
        return response.json(200, {
            message: "Request Successfull!",
            data: {
                friendship: friendship
            }
        });
    } catch (error) {
        console.log(error);
        return response.json(500, {
            message: 'Internal Sever Error'
        });
    }
};