const { jwt } = require("../index");

const verifyAndGetId = (token) => {
  let decodedId;

  jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
    if (err) {
      return;
    }
    decodedId = decoded.id;
  });
  return decodedId;
};

const verifyAndGetIdAndOtherInfo = (token) => {
  let result;
  jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
    if (err) {
      return;
    }
    result = decoded;
  });
  return result;
};

module.exports = {
  verifyAndGetId,
  verifyAndGetIdAndOtherInfo,
};
