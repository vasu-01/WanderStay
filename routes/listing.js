const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
// const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});
// const upload = multer({ dest: 'uploads/' });

const listingController=require("../controllers/listings.js");


//Use of router.route : we use this to combine two same path 
router.route("/")
//Index Route which will be like home show all data
.get(wrapAsync(listingController.index))
//Create Route to post filled data to save in db and redirect to listings page
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));


//New Route to create new listings
router.get("/new",isLoggedIn,listingController.renderNewForm);
  

router.route("/:id")
//Show Route/read route which will show particular details from db
.get(wrapAsync(listingController.showListing))
//Update Route which will update the edited info in edit route
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListings))
//Delete Route
.delete(isLoggedIn,isOwner,(listingController.deleteListings));




//Edit Route for the listed data
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListings));



module.exports=router;
  