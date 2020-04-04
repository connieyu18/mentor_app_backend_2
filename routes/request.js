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
    new_request.save()
      .then((result)=>{
        console.log("CREATED"+result)
        Availability.findOne({ _id: avail_objectId},(err,availability)=>{
          console.log("AVAI"+availability)
          if(availability){
              availability.meetings_requests.push(new_request)
              availability.save(); 
          }
        })
      })

      // if (err) {
      //   throw err;
      // } else {
      //   //push the meetings request to teh availability
      //   Availability.findOneAndUpdate(
      //     { _id: avail_objectId },
      //     { $push: { meetings_requests: result } },
      //     { new: true },
      //     function(err, doc) {
      //       User.updateOne(
      //         { _id: recipient_objectId },
      //         { $set: { availabilities: doc } }
      //       ).then(res => console.log("FFF" + res));
      //     }
      //   );
        // .then(avail_result=>
        //   console.log("DDDD"+ avail_result))
        // User.updateOne(
        //   { _id: recipient_objectId},
        //   { $set: { availabilities: avail_result } }
        // )
        // ).then((res)=>console.log("FFF"+ res))
    //   }
    // });
  // });
});

router.get("/getRequests", (req, res) => {
  let { token } = req.query;
  let secret_key = process.env.SECRET_KEY;
  let userInfo = verifyAndGetIdAndOtherInfo(token);
  User.findById(userInfo.id, function(err, user) {
    console.log(user.availabilities);
  });
});

module.exports = router;
