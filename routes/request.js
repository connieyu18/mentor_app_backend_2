const { router, jwt, authFunctions } = require("../index");
const { MongoClient, ObjectID } = require("mongodb");
var mongoose = require("mongoose");

const {
  verifyAndGetId,
  verifyAndGetIdAndOtherInfo,
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
    availability_id,
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
    sender_profile_img: userInfo.img_url,
    method: "",
    avail_creator: "",
  });
  var avail_objectId = mongoose.Types.ObjectId(availability_id);
  new_request.save().then((result) => {
    Availability.findOne({ _id: avail_objectId }, (err, availability) => {
      Request.updateOne(
        { _id: result._id },
        {
          $set: {
            method: availability.method,
            avail_creator: availability.display_name,
          },
        }
      ).then((res) => console.log("successfully! updated method"));
    });
  });
  Availability.findOne({ _id: avail_objectId }, (err, availability) => {
    if (availability) {
      availability.meetings_requests.push(new_request);
      availability.save();
    }
  });
});

router.get("/getRequests", (req, res) => {
  let token = req.headers.authorization;
  let userInfo = verifyAndGetIdAndOtherInfo(token);
  var data = [];
  Availability.find({
    $and: [
      { email: userInfo.email },
      { meetings_requests: { $exists: true, $ne: [] } },
    ],
  }).then((availabilities) => {
    if (availabilities) {
      res.send({ availabilities });
    }
  });
});

router.get("/getConfirmedMeetings", (req, res) => {
  let token = req.headers.authorization;
  let userInfo = verifyAndGetIdAndOtherInfo(token);
  var data = [];
  User.findOne({ id: userInfo.id }).then((user) => {
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
          avail.meetings_requests.remove({ _id: request_id });
        } else {
          avail.meetings_requests.remove({ _id: request_id });
        }
        avail.save();
      }
    }
  );
  Request.findOne({ _id: request_id }, (err, request) => {
    User.find({ _id: { $in: [userInfo.id, request.sender_id] } }, function (
      err,
      user
    ) {
      if (user) {
        if (confirm_status === "confirm") {
          user.forEach((e) => {
            e.confirmed_meetings.push(request);
            e.save();
          });
        } else {
          user.forEach((e) => {
            e.denied_meetings.push(request);
            e.save();
          });
        }
      }
    }).catch((err) => {
      throw err;
    });
  });
});

module.exports = router;
