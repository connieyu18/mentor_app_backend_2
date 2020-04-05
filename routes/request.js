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
    // display_name,
    // home_city,
    // tech_languages,
    // experience
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
    sender_experience: userInfo.experience
  });
  // var avail_objectId = new ObjectId(availability_id);
  var avail_objectId = mongoose.Types.ObjectId(availability_id);
  var recipient_objectId = mongoose.Types.ObjectId(recipient_id);
  // let la= ObjectId.fromString( availability_id)
  // Availability.findById(avail_objectId).then(availability => {
  new_request.save().then(result => {
    console.log("CREATED" + result);
    Availability.findOne({ _id: avail_objectId }, (err, availability) => {
      if (availability) {
        availability.meetings_requests.push(new_request);
        availability.save();
      }
    });
    User.findOne({ _id: recipient_id }, (err, user) => {
      if (user) {
        user.new_meeting_requests.push(new_request);
        user.save();
      }
    });
  });
});

// router.get("/getRequests", (req, res) => {
//   let { token } = req.query;
//   let secret_key = process.env.SECRET_KEY;
//   let userInfo = verifyAndGetIdAndOtherInfo(token);
//   User.findOne({_id:useInfo.id})
// });

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
      // {
      //   for(var i=0;i<availabilities.length;i++){
      //     data.push( availabilities[i])
      //   }
      //   console.log("DATA"+typeof(data))
      //   res.json({ availabilities });
      // }
    }
  });
});

router.post("/confirmRequest", (req, res) => {
  let { request_id, token, confirm_status } = req.body;
  let userInfo = verifyAndGetIdAndOtherInfo(token);
  if (confirm_status === "confirm") {
    Request.findOne({_id:request_id},(err,request)=>{
      Availability.findOne(
        { "meetings_requests._id": request_id },
        (err, avail) => {
          if (avail) {
            avail.meetings_confirmed.push(request_id);
            avail.meetings_requests.remove({_id:request_id})
            avail.save();
            console.log(avail);
          }
        }
      );
    })
  }
  // .then(avail => {
  //   console.log("AVAIL"+avail)
  //   if(avail){
  //     // console.log("AA"+avail.meetings_confirmed)
  //     avail.meetings_confirmed.push(request_id)
  //     avail.save();
});
//     });
//   }
// });

module.exports = router;
