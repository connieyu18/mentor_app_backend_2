var mongoose = require("mongoose");
// var ObjectID = require("mongodb").ObjectID;
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
    console.log("IN HERE!!!");
    user.forEach((e) => {
      e.pending_friend_requests.push({
        friend_request_id: new ObjectID(),
        friend_id: friend_id,
        friend_name: display_name,
        requester_id: userInfo.id,
        requester_name: userInfo.display_name,
        created_at: new Date(),
      });
      console.log("results" + e);
      e.save();
      res.end();
    });
  });
});

router.post("/confirm", (req, res) => {
  console.log("IN HERE22!!!");
  const {
    confirmFriendStatus,
    friend_request_id,
    requester_id,
    requester_name,
    friend_id,
    friend_name,
  } = req.body;
  console.log("FFF222" + friend_request_id);
  let token = req.body.token;
  let userInfo = verifyAndGetIdAndOtherInfo(token);
  User.findOne(
    {
      _id: userInfo.id,
    },
    (err, user) => {
      if (user) {
        console.log("Updated!!!!!!!!" +user);
        user.pending_friend_requests.remove({ "friend_request_id": friend_request_object_id})
      }
    }
  ).then((res) => console.log(res));
  User.find({ _id: { $in: [requester_id, friend_id] } }, function (err, user) {
    if (user) {
      console.log("FFFFDDDD");
      user.forEach((e) => {
        if(e===userInfo.id){
        e.pending_friend_requests.remove({ "friend_request_id": friend_request_object_id})
        }
        if (confirmFriendStatus === "accept") {
          console.log("accept!!");
          e.confirmed_friend_requests.push({
            friend_id: userInfo.id,
            friend_name: userInfo.display_name,
            requester_id: requester_id,
            requester_name: requester_name,
            created_at: new Date(),
          });
          e.save();
        } else {
          console.log("denied!!");
          e.denied_friend_requests.push({
            friend_id: userInfo.id,
            friend_name: userInfo.display_name,
            requester_id: requester_id,
            requester_name: requester_name,
            created_at: new Date(),
          });
        }
      });
    }
  });
  var friend_request_object_id = mongoose.Types.ObjectId(friend_request_id);
  console.log("cccc" + friend_request_object_id);

  // User.findOne(
  //   {
  //     _id: requester_id,
  //   },
  //   (err, user) => {
  //     if (user) {
  //       console.log("Updated");
  //       user.pending_friend_requests.remove({
  //         friend_request_id: friend_request_id,
  //       },function(err,res){console.log("jjj"+res)});
  //     }
  //   }
  // );
  res.end();
  // e.pending_friend_requests.remove({
  //   "friend_request_id":friend_request_object_id,
  // },(err,res)=>console.log("GGGGG"+res));
});

module.exports = router;
