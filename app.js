var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    Blog = require("./models/blog"),
    User = require("./models/user");

//Requiring routes
var blogRoutes = require("./routes/blog"),
    indexRoutes = require("./routes/index");

//App Config
//mongoose.connect("mongodb://localhost/restful_blog_app", {useNewUrlParser: true});
const dburl = process.env.MONGODB_URL || "mongodb://localhost/restful_blog_app";
mongoose.connect(dburl, {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());

//Passport Config
app.use(require("express-session")({
  secret: process.env.S_KEY,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//User config
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/blogs", blogRoutes);

//Server start
app.listen(process.env.PORT || 3000, process.env.IP, function () {
  console.log("Blog Server Started!!");
});
