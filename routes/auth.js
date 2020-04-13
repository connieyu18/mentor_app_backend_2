const { router, jwt, authFunctions } = require("../index");

const {
  verifyAndGetId,
  verifyAndGetIdAndOtherInfo
} = require("../services/authFunctions.js");

var User = require("../models/user.js");
var bcrypt = require("bcryptjs");

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
        password: bcrypt.hashSync(req.body.password, 4),
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
  let { token, profile_type, tech_languages, home_city, img_url,experience } = req.body;
  let userInfo = verifyAndGetIdAndOtherInfo(token);

  User.updateOne(
    { _id: userInfo.id },
    {
      $set: {
        profile_type: profile_type,
        tech_languages: tech_languages,
        home_city: home_city,
        experience: experience,
        profile_image_url:img_url
      }
    }
  ).then(() => {
    userInfo.profile_type = profile_type;
    userInfo.tech_languages = tech_languages;
    userInfo.home_city = home_city;
    userInfo.experience = experience;
    userInfo.tech_languages = tech_languages;
    userInfo.home_city = home_city;
    userInfo.img_url=img_url;
    let newToken = jwt.sign(userInfo, process.env.SECRET_KEY);
    res.json({ token: newToken, user_id:userInfo.id });
  });
});

router.post("/sign-in", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    var passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password"
      });
    } else {
      let token = jwt.sign(
        {
          id: user._id, //payload datas,
          display_name: user.display_name,
          email: user.email,
          profile_type: user.profile_type,
          tech_languages: user.tech_languages,
          home_city: user.home_city,
          experience:user.experience
        },
        process.env.SECRET_KEY
      );
      return res.send({
        token
      });
    }
  });
});

router.get("/logout", function(req, res) {
  let { token } = req.body;
  let userInfo = verifyAndGetIdAndOtherInfo(token);
  User.find({ _id: userInfo.id }).then(user => {
    if (user) {
      user.logout();
      res.send({ user });
    }
  });
  res.redirect("/");
});

//check if email and password exist
//check if user exists and psasword is correct
//if everything goes well, send token to client

module.exports = router;
