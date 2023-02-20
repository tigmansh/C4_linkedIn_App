const express = require("express");

const { userModel } = require("../models/user.model");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

require("dotenv").config();

const userRouter = express.Router();

// register and hashing the password...

userRouter.post("/register", async (req, res) => {
  const { name, email, gender, pass, age, city } = req.body;

  try {
    const x = await userModel.findOne({ email: req.body.email });
    if (x) {
      res.send({ msg: "User already exist, please login" });
    } else {
      bcrypt.hash(pass, 5, async (err, hash) => {
        if (!err) {
          const user = new userModel({
            name,
            email,
            gender,
            pass: hash,
            age,
            city,
          });
          await user.save();
          res.send({ msg: "User Registered" });
        } else {
          res.send(err.message);
        }
      });
    }
  } catch (err) {
    res.send({ msg: "There is an error", err: err.message });
  }
});

// login and bcrypting the password.....

userRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  try {
    const user = await userModel.find({ email });
    if (user.length > 0) {
      bcrypt.compare(pass, user[0].pass, (err, result) => {
        if (result) {
          const token = jwt.sign({ userID: user[0]._id }, process.env.key, {
            expiresIn: "2h",
          });
          res.send({ msg: "Logged in successfully", token: token });
        } else {
          res.send({ msg: "Wrong Details" });
        }
      });
    } else {
      res.send({ msg: "Wrong Details" });
    }
  } catch (err) {
    res.send({ msg: "There is an error", err: err.message });
  }
});

module.exports = { userRouter };
