const express= require('express');
const router = express.Router();
const wrapAsync = require("../utilis/wrapAsync.js");
const Listing = require('../models/listing.js');
const {isLoggedIn,isOwner,validateListing}=require('../middleware.js');
const listingController = require('../controllers/listing.js')
const multer  = require('multer')
const {storage} = require("../clouldConfig.js")
const upload = multer({ storage })

//index or create route in more compact form
router.route("/")
.get(wrapAsync(listingController.index))
 .post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing))


//new route=create new list
router.get("/new",isLoggedIn,listingController.newRenderForm);

//show update or delete route
router.route("/:id")
.get(wrapAsync(listingController.showRoute))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))

//index route=list of all places(listing)
// router.get("/",wrapAsync(listingController.index))

// //show route = to see specfic list(place)
// router.get("/:id",wrapAsync(listingController.showRoute))

//create route = to create or add new list in main list
// router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createListing));

//edit route = to edit something
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editRenderForm))

//update route=to update the edit changes in the database
// router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))

// //delete route
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))

module.exports=router;