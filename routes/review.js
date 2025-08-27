const express= require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utilis/wrapAsync.js");
const Review = require('../models/reviews.js');
const Listing = require('../models/listing.js');
const {validateReview,isLoggedIn,isReviewAuthor}=require('../middleware.js')
const reviewController =require('../controllers/review.js');

//Reviews
//Post review route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview))

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports=router;