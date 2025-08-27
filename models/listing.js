const mongoose = require('mongoose');
const {Schema} = mongoose;
const Review = require("./reviews.js");
const reviews = require('./reviews.js');

const listingSchema =new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
        //type:String,
       // default:"https://images.unsplash.com/photo-1683009427500-71296178737f?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",//tis work when image he nhi hai koi to by default ye set kr do
       // set:(v)=>v===""?"https://images.unsplash.com/photo-1683009427500-71296178737f?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,//this work when image to aa rhi hai pr empty hai to ye link paste kr do wrna jo image hai vo paste kr do
       url:String,
       filename:String
    },
    price:{
        type:Number,
       // required:true
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{//define a middleware when we delete the listing the reviews inside this also delete from the database esa krne ke liye es middleware define krenge
    if(listing){//jese he findOneAndDelete call hoga vese he ye wala middleware trigger ho jayega // esme uss listing ka data aayega jo delete hui hai
   await Review.deleteMany({_id:{$in:listing.reviews}});//review mai un review ko delete krna hai jo meri delete wali listing ke andar reviews wale array mai hai
    }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;