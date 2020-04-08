var mongoose = require("mongoose");

const { router, jwt, authFunctions } = require("../index");
const {
  verifyAndGetId,
  verifyAndGetIdAndOtherInfo
} = require("../services/authFunctions.js");
var User = require("../models/user.js");

router.post("/add", (req, res) => {
  console.log("IN HERE!!!");
  let { friend_id, display_name } = req.body;
  let token = req.body.token;
  let userInfo = verifyAndGetIdAndOtherInfo(token);
  User.findOne({ _id: userInfo.id }, (err, user) => {
    if (user) {
      user.friend_requests.push({
        friend_id: friend_id,
        friend_name: display_name
      });
      user.save();
      console.log("added friend");
    }
  });
});

router.post("/get_friends", (req, res) => {
  console.log("IN HERE111!!!");
  let token = req.body.token;
  let userInfo = verifyAndGetIdAndOtherInfo(token);
  User.findOne({ _id: userInfo.id }, (err, user) => {
    if (user) {
      user.friend_requests.push({
        friend_id: friend_id,
        friend_name: display_name
      });
      user.save();
      console.log("added friend");
    }
  });
});

router.post("/confirm", (req, res) => {
  console.log("IN HERE22!!!");
  const { confirmFriendStatus, friend_id, friend_name } = req.body;
  console.log("FFFFF" + friend_id);
  let token = req.body.token;
  let userInfo = verifyAndGetIdAndOtherInfo(token);
  User.findOne({ _id: userInfo.id }, (err, user) => {
    if (user) {
      console.log("FFFFDDDD");
      if (confirmFriendStatus === "accept") {
        console.log("accept!!");
        user.confirmed_friend_requests.push({
          friend_id: friend_id,
          friend_name: friend_name
        });
      } else {
        console.log("denied!!");
        user.denied_friend_requests.push({
          friend_id: friend_id,
          friend_name: friend_name
        });
        console.log("denied");
      }
      user.friend_requests.remove({ "friend_id": friend_id });
      user.save();
    }
  });
  User.findOne({ _id: friend_id }, (err, user) => {
    if (user) {
      if (confirmFriendStatus === "accept") {
        user.confirmed_friend_requests.push({
          friend_id: userInfo.id,
          friend_name: userInfo.name
        });
        user.save();
        console.log("accept friend");
      } else {
        user.denied_friend_requests.push({
          friend_id: userInfo.id,
          friend_name: userInfo.name
        });
        user.save();
        console.log("denied");
      }
    }
  });
});

module.exports = router;
