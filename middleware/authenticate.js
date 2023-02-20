const jwt = require("jsonwebtoken");
require("dotenv").config();

const authentication = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.send("Please Login");
  } else {
    const decoding = jwt.verify(token, process.env.key);
    if (decoding) {
      req.body.userID = decoding.userID;
      next();
    } else {
      res.send("Please Login");
    }
  }
};

module.exports = { authentication };