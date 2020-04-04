const { router, jwt, authFunctions,axios } = require("../index");
const {
  verifyAndGetId,
  verifyAndGetIdAndOtherInfo
} = require("../services/authFunctions.js");

var User = require("../models/user.js");

router.get("/getSearchResults", (req, res) => {
  let token = req.headers.authorization;
  let inputData = req.query;
  let userInfo = verifyAndGetIdAndOtherInfo(token);

  User.find({
    profile_type: { $not: { $regex: userInfo.profile_type } },
    $or: [
      { tech_languages: { $in: inputData.tech_languages } },
      { home_city: inputData.home_city },
      { experience: inputData.experience }
    ]
  }).then(collection => {
    res.json({ collection });
  });
});

router.get("/getAllResults", (req, res) => {
  let token = req.headers.authorization;
  let inputData = req.query;
  let userInfo = verifyAndGetIdAndOtherInfo(token);
  User.find({
    _id: { $ne: userInfo.id }, //ne=not equal
    profile_type: { $ne: userInfo.profile_type}
    // profile_type: { $not: { $regex: userInfo.profile_type } }
  }).then(collection => {
    res.json({ collection });
  });
});

module.exports = router;
