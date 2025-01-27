const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const jwt = require("jsonwebtoken");
const secretKey = "mandu";
const User = require('../models/User');
const moment = require('moment');


router.post("/create-blog", async (req, res) => {
  const utcTimestamp = new Date();
  const localTime = moment.utc(utcTimestamp).local().format('D/M/YYYY, h:mm A');
  try {
    const token= req.body.token;
    const localTime1 = moment.utc(req.body.publishTime).local();
    const decodedToken = jwt.decode(token);
    if (decodedToken) {
      try {
        const verifiedToken = jwt.verify(token, secretKey);
        const userInfo = verifiedToken.user;
        const fullName = userInfo.firstName + " " + userInfo.lastName;
        const authorName=fullName;
        const blog = await Blog.create({
          ...req.body,
          publishTime:localTime1,
          createdAt:localTime,
          modifiedAt:localTime,
          createdBy: fullName,
          modifiedBy: fullName,
          email:userInfo.email
        });
        res.status(201).json({blog,authorName});
       
      } catch (error) {
        res.status(400).json({ "Error verifying token:": error.message });
      }
    } else {
      console.error("Invalid token.");
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

// Get all blogs
router.get("/get-blogs", async (req, res) => {
  try {
    const blogs = await Blog.find();
    const users = await User.find();
    const authorNames=users.map(users=>`${users.firstName} ${users.lastName}`);

    res.json({blogs,authorNames});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//get published blogs
router.get("/published_blogs", async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get a specific blog
router.get("/:id", async(req, res) => {
  
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog == null) {
      return res.status(404).json({ message: "Cannot find blog" });
    }
    res.json(blog)
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

});

//get a specific blog using slug
router.get("/blogdetail/:slug", async(req, res) => {
  try {
    const blog = await Blog.findOne({url:`/${req.params.slug}`});

    if (blog == null) {
      return res.status(404).json({ message: "Cannot find blog" });
    }
    res.json(blog);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

});

// Update a blog
router.patch("/:id", async (req, res) => {
  const utcTimestamp = new Date();
const localTime = moment.utc(utcTimestamp).local().format('D/M/YYYY, h:mm A');
const localTime1 = moment.utc(req.body.publishTime).local();
try {
  const token= req.body.token;
  const decodedToken = jwt.decode(token);
  if (decodedToken) {
    try {
      const verifiedToken = jwt.verify(token, secretKey);
      const userInfo = verifiedToken.user;
      const fullName = userInfo.firstName + " " + userInfo.lastName;
      let blog = await Blog.findOneAndUpdate(
        { _id: req.params.id },
        { ...req.body }
      );
      blog.modifiedBy=fullName
      blog.modifiedAt=localTime;
      blog.publishTime=localTime1;
      const updatedBlog = await blog.save();
      res.json(updatedBlog);
     
    } catch (error) {
      console.error("Error verifying token:", error.message);
    }
  } else {
    console.error("Invalid token.");
  }
} catch (err) {
  console.log(err);
  res.status(400).json({ message: err.message });
}
});

// Delete a blog
router.delete("/delete_blog/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Blog.findByIdAndDelete(id);
    res.status(200).json({ message: req.params.id });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
