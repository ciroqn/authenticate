//jshint esversion:6
require("dotenv").config();
 const express = require("express");
 const bodyParser = require("body-parser");
 const ejs = require("ejs");
 const mongoose = require("mongoose");
 const encrypt = require("mongoose-encryption");

 const app = express();

 app.use(express.static("public"));
 app.set('view engine', 'ejs');
 app.use(bodyParser.urlencoded({
   extended: true
 }));

 mongoose.connect("mongodb://localhost:27017/userDB");

 // create Schema
 const userSchema = new mongoose.Schema({
   email: String,
   password: String
 });

 userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

 const User = new mongoose.model("User", userSchema);

 app.get("/", function(req, res) {
   res.render("home");
 });

 app.get("/login", function(req, res) {
   res.render("login");
 });

 app.get("/register", function(req, res) {
   res.render("register");
 });

 // get info from html form and save as new user. This info is from /register page
 app.post("/register", function(req, res) {
   const newUser = new User({
     email: req.body.username,
     password: req.body.password
   })
   // the secrets page can only be accessed when a user signs up. notice how 'secrets' does not have a get route.
   newUser.save(function(err) {
     if (err) {
       console.log(err);
     } else {
       res.render("secrets");
     }
   })
 })

 app.post("/login", function(req, res) {
   const username = req.body.username;
   const password = req.body.password;

   User.findOne({email: username}, function(err, foundUser) {
     if (err) {
       console.log(err);
     } else {
       if (foundUser) {
         if (foundUser.password === password){
           res.render("secrets");
         }
       }
     }
   })
 })


 app.listen(3000, function() {
   console.log("Server started on port 3000.");
 })
