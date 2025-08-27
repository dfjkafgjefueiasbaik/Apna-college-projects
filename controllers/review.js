const Listing = require("../models/listing");
const Review = require("../models/reviews")

module.exports.createReview =async(req,res)=>{
  let listing = await Listing.findById(req.params.id);//find tthe listing info by id
  let newReview = new Review(req.body.review);//create a review in which info is goes from review object review[content],review[rating] se sare info esme aa jayegi jo bhi req ke send krenge
  newReview.author=req.user._id;//if user was logged in check by our middleware then get the id of author feom req.user which store the information of curruser
  console.log(newReview);
  listing.reviews.push(newReview);//establish one to many relation so automatically id was pushed only
  await newReview.save();
  await listing.save();
  // console.log("new review saved");
  // res.send("review saved");
   req.flash("success","New review was added");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview =async(req,res,next)=>{
  let {id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});//use this pull operator ki listing is es wali id mai jao or use es wali reviewid pr jao or es review ko delete kr do//pull means remove
  await Review.findByIdAndDelete(reviewId);//delete the review
   req.flash("success","Review deleted");
  res.redirect(`/listings/${id}`);
}