const { router, jwt, authFunctions } = require("../index");
const {
  verifyAndGetId,
  verifyAndGetIdAndOtherInfo
} = require("../services/authFunctions.js");
var Availability = require("../models/availability.js");
var User = require("../models/user.js");

router.post("/create", (req, res) => {
  let { start_date, end_date, start_time, end_time, method } = req.body;
  let token = req.body.token;
  let userInfo = verifyAndGetIdAndOtherInfo(token);
  let new_availability = new Availability({
    display_name: userInfo.display_name,
    email: userInfo.email,
    start_date: start_date,
    end_date: end_date,
    start_time: start_time,
    end_time: end_time,
    created_at: new Date(),
    method: method
  });
    new_availability.save()
    .then((result)=>{
      User.findOne({_id:userInfo.id},(err,user)=>{
        if(user){
          user.availabilities.push(new_availability);
          user.save();
          res.json({avail:result})
        }
      })
    })
});



router.get("/getAvail", (req, res) => {
  let token = req.headers.authorization;
  let userInfo = verifyAndGetIdAndOtherInfo(token);
  User.findOne({ _id: userInfo.id }).then(user => {
    if(user){
      res.json({ availabilities: user.availabilities });
    }
    // console.log("this is users!!!", user[0].availabilities)
  });
});



// router.put("/delete", (req, res) => {
//   let token = req.body.token;
//   let userInfo = verifyAndGetIdAndOtherInfo(token);
//   let { selectedRowKeys } = req.body;
//   for(var i=0; i<selectedRowKeys.length; i++){
// //   User.update({ _id: userInfo.id },{$set:{availabilities:}}
// //        { $pull: {"availabilities":{$eq:selectedRowKeys[i]}}}
// //   );
//   }
// });

module.exports = router;
