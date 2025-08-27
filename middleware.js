const Listing =  require("./models/listing");
const Review = require("./models/reviews.js");
const ExpressError = require("./utilis/ExpressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");


module.exports.isLoggedIn=(req,res,next)=>{//create as middleware and use before creating new listing,edit update and delete as middleware
  console.log(req.path,"..",req.originalUrl);//req.path print the path which we want to go and req.originalUrl print the path which we want to go from starting 
  console.log(req.user);//by this we can check we are login or not
    if(!req.isAuthenticated()){//this method is inbuilt method in passport which automatically check that the user is login  if login it return true  //this checking was done on the basis of serializablity (in this store the store the info of user so check the current user in present in this info or not)
      req.session.redirectUrl = req.originalUrl;//in session object iin req we made a variable name redirectUrl which store the information of req.origninalUrl
    req.flash("error","You are must be logged to create the listing");
   return res.redirect("/login");//jese he hm login krenge hmari req ke andar user related info store ho jayegi
  }
  next();
}

module.exports.saveRedirectURl=(req,res,next)=>{
  if(req.session.redirectUrl){//agar mere req.session.redirectUrl mai kuch information save hui hai to usko locals mai dal do
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner =async (req,res,next)=>{
   let {id} = req.params;
       let listingss =await Listing.findById(id);
       if(!res.locals.currUser._id.equals(listingss.owner._id)){
         req.flash("error","You are not have a permission to make changes in this Listing");
        return res.redirect(`/listings/${id}`);
       }
       next();
}


module.exports.validateListing = (req,res,next)=>{//act as middleware in this check all feild are filled by client or not on server side this variable used in create or update route in this we check first validation by this middleware then do further works
  let {error} = listingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");//error details are in the form of object jo to extract the message from this object we use this// jitne bhi sari error hogi unki details ka msg aa jayega or unko preint krwana bss
    throw new ExpressError(400,errMsg);
  }else{
    next();//if error not occur then call for next
  }
}

module.exports.validateReview = (req,res,next)=>{
  let {error} = reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
     throw new ExpressError(400,errMsg);
  }else{
    next();//if error not occur then call for next
  }
}

module.exports.isReviewAuthor=async (req,res,next)=>{
   let {id,reviewId} = req.params;
       let reviews =await Review.findById(reviewId);
       if(!res.locals.currUser._id.equals(reviews.author._id)){
         req.flash("error","You are not have a permission to make changes in this Review");
        return res.redirect(`/listings/${id}`);
       }
       next();
}