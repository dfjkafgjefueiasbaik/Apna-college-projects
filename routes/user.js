const express= require('express');
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require('../utilis/wrapAsync');
const passport = require('passport');
const {saveRedirectURl}= require("../middleware.js");
const userController = require('../controllers/user.js');

router.route("/signup")
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.signup))

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectURl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login)


// router.get("/signup",userController.renderSignUpForm);

// router.post("/signup",wrapAsync(userController.signup));

// router.get("/login",userController.renderLoginForm);

// router.post("/login",saveRedirectURl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login);

//to logout the user
router.get("/logout",userController.logout);

module.exports=router;