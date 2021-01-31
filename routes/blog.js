var express = require("express");
var router = express.Router();
var Blog = require("../models/blog");
var middleware = require("../middleware/index");

//RESTful Routes
//Index Route
router.get('/', function (req, res) {
  Blog.find({}, function (err, blogs) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {blogs: blogs});
    }
  });
});

//New Route
router.get('/new', middleware.isLoggedIn, function (req, res) {
  res.render("new");
});

//Create Route
router.post('/', middleware.isLoggedIn, function (req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  var newblog = {
    title: req.body.blog.title,
    image: req.body.blog.image,
    body: req.body.blog.body,
    author: {
      id: req.user._id,
      username: req.user.username
    }
  };
  Blog.create(newblog, function (err, newlycreated) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/blogs");
    }
  });
});

//Show Route
router.get('/:id', function (req, res) {
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err || !foundBlog) {
      req.flash("error", "Blog not found!");
      res.redirect("/blogs");
    } else {
      res.render("show", {blog: foundBlog});
    }
  });
});

//Edit Route
router.get('/:id/edit', middleware.checkBlogOwnership, function (req, res) {
  Blog.findById(req.params.id, function (err, foundBlog) {
      res.render("edit", {blog: foundBlog});
  });
});

//Update Route
router.put('/:id', middleware.checkBlogOwnership, function (req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

//Delete Route
router.delete('/:id', middleware.checkBlogOwnership, function (req, res) {
  Blog.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});

module.exports = router;
