const Listing = require('../models/listing.js');

module.exports.index = async (req,res)=>{
   const allListings=await Listing.find({});
   res.render("listings/index.ejs",{allListings});
};

module.exports.newRenderForm=(req,res)=>{
  console.log(req.user);//check user is present or not
  res.render("listings/new.ejs");
}

module.exports.showRoute = async (req,res)=>{
    let {id} = req.params;
    //in this below populate we use nested populate in which we want for all listing give all reviews and for individual review we want their author
     const  listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");//by using populate it give the whole id object of review from reviews and owner from listings
     if(!listing){
       req.flash("error","Listing you requested is not exist!");
        return res.redirect("/listings");
     }
   //  console.log(listing)
     res.render("listings/show.ejs",{listing});
};

module.exports.createListing=async(req,res,next)=>{
    // let {title , description,image,price,location ,country} = req.body;//ese bhi kr skte hai
  //  let listing = req.body.listing;//in this made the listing object in which title,imge,price etc are key value pair then req.body se listing object ko print krwa lo//in this listing object create 
  // let newListing= new Listing(req.body.listing);//in this directly add the created listing object into our Listing(all places list)
 // try{
    let url = req.file.path;//for extracting info from req.file use in to save files in mongoGb from cloud
    let filename = req.file.filename;
    console.log(url,"..",filename);
     const data = req.body.listing;
     if(!data){//if user send empty page or not send data then this error occur
        throw new ExpressError(400,"Data not exist");
     }
    const newListing = new Listing(data);
   //by this we handle the error for particular feilds when they are not writen by client then throw error but what would we do when many feilds exist
    // if(!newListing.description){
    //   throw new ExpressError(400,"Description not exist");
    // }
    //  if(!newListing.title){
    //   throw new ExpressError(400,"Title not exist");
    // }
    

    //hndle all feilds together   it is inside the create route but if we want to use this as middle ware so define in upper part
  //  const result= listingSchema.validate(req.body);//means jo req.body ke andar client ne jo bheja hai kya vo listingSchema mai present schema ko satisfy kr rha hai 
  //  console.log(result);//if feild not present then give and specify the error and also give present result
  //  if(result.error){
  //   throw new ExpressError(400,result.error);
  //  }
  newListing.owner=req.user._id;
  newListing.image = {url,filename};
   await newListing.save();
   req.flash("success","New listing was created");
 res.redirect("/listings");
//   } catch(err){
//     //console.log(err);
//     next(err);
//   }
};


module.exports.editRenderForm = async(req,res)=>{
    let {id}= req.params;
     const  listing=await Listing.findById(id);
      if(!listing){
       req.flash("error","Listing you requested is not exist!");
        return res.redirect("/listings");
     }
     let orignalImageUrl = listing.image.url;
    orignalImageUrl= orignalImageUrl.replace("/upload","/upload/h_250,w_250/e_blur:100")
    res.render("listings/edit.ejs",{listing,orignalImageUrl});
};

module.exports.updateListing =async(req,res)=>{
  let {id} = req.params;
    const data = req.body.listing;
     if(!data){
        throw new ExpressError(400,"Data not exist");
     }
    //  this is used as middleware for delete update edit route
    //  let {id} = req.params;
    //  let listingss =await Listing.findById(id);
    //  if(!res.locals.currUser._id.equals(listingss.owner._id)){//particular listing ko uss listing ka owner he change kr skta hai koi or nhi es chiz ka authorization hai
    //    req.flash("error","You are not have a permission to make changes in this Listing");
    //   return res.redirect(`/listings/${id}`);
    //  }
  let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});//ye object hai jo sari fields ko edit feild mai se extract kr rhi hai or unko updated value ke sath replace kr rhi hai//it not upload the new file it made changes only on the text form
  if(typeof req.file!=="undefined"){//agar image mai change aaye ho to he esko change karo
  let url = req.file.path;//for extracting info from req.file use in to save files in mongoGb from cloud
    let filename = req.file.filename;
      listing.image = {url,filename};
     await listing.save();
  }
   req.flash("success","Listing was updated");
   res.redirect(`/listings/${id}`);//this was redirect on show route 
}

module.exports.destroyListing = async(req,res)=>{
    let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
     req.flash("success","listing was deleted");
    res.redirect("/listings");
}