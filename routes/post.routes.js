const express = require("express");

const { postModel } = require("../models/post.model");

require("dotenv").config();

const postRouter = express.Router();

postRouter.get("/", async (req, res) => {
  try {
    const data = await postModel.find({ userID: req.body.userID });
    if (data.length > 0) {
      res.send(data);
    } else {
      res.send({ msg: "No posts found" });
    }
  } catch (err) {
    res.send({ err: err.message });
  }
});

// to get the post which has highest number of comments...

postRouter.get("/top", async (req, res) => {
  try {
    const data = await postModel.find({ userID: req.body.userID });
    if (data.length > 0) {
      let max = -Infinity;
      for (let post of data) {
        if (post.no_of_comments > max) {
          max = post.no_of_comments;
        }
      }
      let topPost = await postModel.find({ no_of_comments: max });
      if (topPost.length > 0) {
        res.send(topPost);
      }
    }
  } catch (err) {
    res.send({ err: err.message });
  }
});

// posting on linkedIn
postRouter.post("/createpost", async (req, res) => {
  const post = req.body;
  try {
    const posting = new postModel(post);
    await posting.save();
    res.send("Post created");
  } catch (err) {
    res.send({ Error: err.message });
  }
});

// update the post...
postRouter.patch("/update/:id", async (req, res) => {
  const payload = req.body;
  const id = req.params.id;
  const post = await postModel.findOne({ _id: id });

  try {
    if (post.userID === req.body.userID) {
      await postModel.findByIdAndUpdate({ _id: id }, payload);
      res.send("POST UPDATED 👍");
    } else {
      res.send({ msg: "You don't have authority to do this" });
    }
  } catch (err) {
    res.send({ err: err.message });
  }
});

// delete the post...

postRouter.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const post = await postModel.findOne({ _id: id });
  try {
    if (post.userID === req.body.userID) {
      await postModel.findByIdAndDelete({ _id: id });
      res.send("POST DELETED 👍");
    } else {
      res.send({ msg: "You don't have authority to do this" });
    }
  } catch (err) {
    res.send({ err: err.message });
  }
});

module.exports = { postRouter };
