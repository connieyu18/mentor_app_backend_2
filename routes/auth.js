const { router } = require("../index");

var User = require("../models/user.js");

//sign up
router.post("/signup", (req, res) => {
  let { display_name, email, password } = req.body;

  User.findOne({ email }).then(user => {
    if (user) {
      res.json({ error: "User already exists" });
    } else {
      let new_user = new User({
        display_name,
        email,
        password,
        created_at: new Date()
      });

      new_user.save(function(err) {
        if (err) {
          res.json({ error: "Something went wrong while creating new user" });
        } else {
          // come back for jwt token
          res.json({ token: "af;askjdfskadnf" });
        }
      });
    }
  });
});

// router.post("/sign-up-form", (req, res) => {
//   let { _id, profile_type, tech_languages, home_city, experience } = req.body;
//   User.findOne({ _id }).then(user => {
//     if (user) {
//       User.updateOne({ _id: _id }, { $set: { 
//         profile_type: profile_type, 
//         tech_languages: tech_languages,
//         home_city:home_city,
//         experience :experience,
//       } 
//     });
//     } else {
//       res.json({ error: "User email doesn't match" });
//     }
//   });
// });



module.exports = router;
