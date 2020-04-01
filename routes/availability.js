const { router, jwt, authFunctions } = require("../index");
const { verifyAndGetId, verifyAndGetIdAndOtherInfo } = require("../services/authFunctions.js");
var Availability = require("../models/availability.js");
var User = require("../models/user.js");


router.post("/create", (req, res)=> {
    let {start_date, end_date, start_time, end_time}= req.body;
  let token = req.headers.authorization;
  let new_availability=new Availability({
    start_date, end_date, start_time, end_time
  })
  new_availability.save(function(err,result){
      if(err){
          res.json({error: "Something went wrong while creating new availability" })
      }else{
          res.json("Succesfully added new availability", result)
      }
  })
//   let userInfo = verifyAndGetIdAndOtherInfo(token);
//   let new_availability= new Availability({

//   })
//   Availability.save
    res.end();
})

module.exports = router;