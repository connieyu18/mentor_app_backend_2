var mongoose = require("mongoose");
const { MongoClient, ObjectID } = require("mongodb");

const { router, jwt, authFunctions } = require("../index");
const {
  verifyAndGetId,
  verifyAndGetIdAndOtherInfo,
} = require("../services/authFunctions.js");
var User = require("../models/user.js");

router.post("/add", (req, res) => {
  let { friend_id, display_name } = req.body;
  let token = req.body.token;
  let userInfo = verifyAndGetIdAndOtherInfo(token);
  User.find({ _id: { $in: [userInfo.id, friend_id] } }, (err, user) => {
    const friend_filtered1 = user.filter((e) => e._id == friend_id);
    user.forEach((e) => {
      e.pending_friend_requests.push({
        friend_request_id: new ObjectID(),
        friend_id: friend_id,
        friend_name: display_name,
        requester_id: userInfo.id,
        requester_name: userInfo.display_name,
        profile_image_url: userInfo.profile_image_url,
        created_at: new Date(),
      });
      e.save();
      res.end();
    });
  });
});

router.post("/confirm", (req, res) => {
  const {
    confirmFriendStatus,
    friend_request_id,
    requester_id,
    requester_name,
    friend_id,
    friend_name,
  } = req.body;
  let token = req.body.token;
  let userInfo = verifyAndGetIdAndOtherInfo(token);
  User.findOne(
    {
      _id: userInfo.id,
    },
    (err, user) => {
      if (user) {
        user.pending_friend_requests.remove({
          friend_request_id: friend_request_object_id,
        });
      }
    }
  ).then((res) => console.log(res));
  User.find({ _id: { $in: [requester_id, friend_id] } }, function (err, user) {
    if (user) {
      user.forEach((e) => {
        if (e._id == userInfo.id) {
          e.pending_friend_requests.map((item, index) => {
            if (item.friend_request_id == friend_request_id) {
              e.pending_friend_requests.splice(index, 1);
              e.save();
            }
          });
        }
        let friend_filtered = user.filter((i) => i._id == requester_id);
        if (confirmFriendStatus === "accept") {
          e.confirmed_friend_requests.push({
            friend_id: userInfo.id,
            friend_name: userInfo.display_name,
            requester_id: requester_id,
            requester_name: requester_name,
            profile_image_url: friend_filtered[0].profile_image_url,
            created_at: new Date(),
          });
          e.save();
        } else {
          e.denied_friend_requests.push({
            friend_id: userInfo.id,
            friend_name: userInfo.display_name,
            requester_id: requester_id,
            requester_name: requester_name,
            profile_image_url: friend_filtered[0].profile_image_url,
            created_at: new Date(),
          });
        }
      });
    }
  });
  var friend_request_object_id = mongoose.Types.ObjectId(friend_request_id);
  res.end();
});

module.exports = router;
