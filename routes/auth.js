const { router, jwt, authFunctions } = require("../index");

const { verifyAndGetId,verifyAndGetIdAndOtherInfo } = require("../services/authFunctions.js");

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

      new_user.save(function(err, result) {
        if (err) {
          res.json({ error: "Something went wrong while creating new user" });
        } else {
          let token = jwt.sign(
            {
              id: result._id, //payload datas,
              display_name: result.display_name,
              email: result.email
            },
            process.env.SECRET_KEY
          );

          res.json({ token });
        }
      });
    }
  });
});

router.put("/signupform", (req, res) => {
  let { token, profile_type, tech_languages, home_city, experience } = req.body;
  let userInfo = verifyAndGetIdAndOtherInfo(token);

  User
    .updateOne(
      { _id: userInfo.id},
      {
        $set: {
          profile_type: profile_type,
          tech_languages: tech_languages,
          home_city: home_city,
          experience: experience
        }
      }
    )
    .then(() =>{
      userInfo.profile_type = profile_type;
      userInfo.tech_languages = tech_languages;
      userInfo.home_city = home_city;
      userInfo.experience = experience;
      userInfo.tech_languages= tech_languages;
      userInfo.home_city = home_city;
      let newToken = jwt.sign(userInfo, process.env.SECRET_KEY);
      res.json({token: newToken})
    })
})
module.exports = router;
