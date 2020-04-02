const { router, jwt, authFunctions } = require("../index");
const {
  verifyAndGetId,
  verifyAndGetIdAndOtherInfo
} = require("../services/authFunctions.js");
var Availability = require("../models/availability.js");
var User = require("../models/user.js");

router.post("/create", (req, res) => {
  let { start_date, end_date, start_time, end_time } = req.body;
  let token = req.body.token;
  let userInfo = verifyAndGetIdAndOtherInfo(token);
  let new_availability = new Availability({
    display_name: userInfo.display_name,
    email: userInfo.email,
    start_date: start_date,
    end_date: end_date,
    start_time: start_time,
    end_time: end_time,
    created_at: new Date()
  });
  User.find({ _id: userInfo.id }).then(user => {
    new_availability.save(function(err, result) {
      if (err) {
        throw err;
        res.json({
          error: "Something went wrong while creating new availability"
        });
        return;
      } else {
        console.log("success");
        User.updateOne(
          { _id: userInfo.id },
          { $push: { availabilities: result } }
        ).then(() => console.log("updated User Availability"));
      }
    });
  });
  res.end();
});

router.get("/getAvail", (req, res) => {
  let token = req.headers.authorization;
  let userInfo = verifyAndGetIdAndOtherInfo(token);
  User.find({ _id: userInfo.id }).then(user => {
    res.json({ user });
  })
});

module.exports = router;
