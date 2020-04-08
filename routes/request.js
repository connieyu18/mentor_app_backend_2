const { router, jwt, authFunctions } = require("../index");
const { MongoClient, ObjectID } = require("mongodb");
var mongoose = require("mongoose");

const {
  verifyAndGetId,
  verifyAndGetIdAndOtherInfo
} = require("../services/authFunctions.js");

var User = require("../models/user.js");
var Availability = require("../models/availability.js");
var Request = require("../models/request.js");

// recipient= other user
// sender=user
router.post("/create-request", (req, res) => {
  let {
    requested_date,
    requested_time,
    recipient_id,
    availability_id
  } = req.body;
  let token = req.body.token;
  let userInfo = verifyAndGetIdAndOtherInfo(token);
  let new_request = new Request({
    sender_id: userInfo.id,
    recipient_id: recipient_id,
    requested_date: requested_date,
    requested_time: requested_time,
    created_at: new Date(),
    availability_id: availability_id,
    sender_name: userInfo.display_name,
    sender_home_city: userInfo.home_city,
    sender_tech_lang: userInfo.tech_languages,
    sender_experience: userInfo.experience,
    method: "",
    avail_creator: ""
  });
  var avail_objectId = mongoose.Types.ObjectId(availability_id);
  var recipient_objectId = mongoose.Types.ObjectId(recipient_id);
  new_request.save().then(result => {
    Availability.findOne({ _id: avail_objectId }, (err, availability) => {
      Request.updateOne(
        { _id: result._id },
        { $set: { "method": availability.method, "avail_creator":availability.display_name } }
      ).then(res => console.log("successfully! updated method"));
    });
  });
  Availability.findOne({ _id: avail_objectId }, (err, availability) => {
    if (availability) {
      console.log("before" + availability);
      availability.meetings_requests.push(new_request);
      availability.save();
      console.log("after" + availability);
    }
    // User.findOne({ _id: userInfo.id }, (err, user) => {
    //   if (user) {
    //     user.pending_meetings.push(new_request); //TODO:need to remove when confirmed
    //     user.save();
    //   }
    // });
  });
});

router.get("/getRequests", (req, res) => {
  let token = req.headers.authorization;
  let userInfo = verifyAndGetIdAndOtherInfo(token);
  var data = [];
  Availability.find({
    $and: [
      { email: userInfo.email },
      { meetings_requests: { $exists: true, $ne: [] } }
    ]
  }).then(availabilities => {
    if (availabilities) {
      // var data={};
      // availabilities.forEach(function(doc){
      //   data["availability"]=doc
      // })
      res.send({ availabilities });
      console.log("DATA" + availabilities);
    }
  });
});

router.get("/getConfirmedMeetings", (req, res) => {
  let token = req.headers.authorization;
  let userInfo = verifyAndGetIdAndOtherInfo(token);
  var data = [];
  console.log("DDD" + userInfo);
  User.findOne({ id: userInfo.id }).then(user => {
    if (user) {
      res.json({ confirmed_meetings: user.confirmed_meetings });
    }
  });
});

router.post("/confirmRequest", (req, res) => {
  let { request_id, token, confirm_status } = req.body;
  let userInfo = verifyAndGetIdAndOtherInfo(token);
  Availability.findOne(
    { "meetings_requests._id": request_id },
    (err, avail) => {
      if (avail) {
        if (confirm_status === "confirm") {
          // avail.meetings_confirmed.push(request); //TODO:not sure if you need this
          avail.meetings_requests.remove({ _id: request_id });
        } else {
          // avail.meetings_denied.push(request);//TODO:not sure if you need this
          avail.meetings_requests.remove({ _id: request_id });
        }
        avail.save();
        console.log("AVA" + avail);
      }
    }
  );
  Request.findOne({ _id: request_id }, (err, request) => {
    User.find({ _id: { $in: [userInfo.id, request.sender_id] } }, function(
      err,
      user
    ) {
      if (user) {
        console.log("thisis" + user);
        if (confirm_status === "confirm") {
          user.forEach(e => {
            // if (e._id == userInfo.id) {
            //   User.confirmed_meetings.updateOne(
            //     { _id: userInfo.id },
            //     { $set: { avail_creator: e.display_name} }
            //   ).then(res => console.log(res,"successfully !!!!!!!"))
            // }
            e.confirmed_meetings.push(request);
            e.save();
            console.log("ID" + e._id);
          });
        } else {
          user.forEach(e => {
            e.denied_meetings.push(request);
            e.save();
          });
        }

        console.log("AAA" + user);
      }
    }).catch(err => {
      throw err;
    });
  });
});

// .then(avail => {
//   console.log("AVAIL"+avail)
//   if(avail){
//     // console.log("AA"+avail.meetings_confirmed)
//     avail.meetings_confirmed.push(request_id)
//     avail.save();

//     });
//   }
// });

module.exports = router;
