const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {isLoggedIn,validateReview, isReviewAuthor}=require("../middleware.js");

const listingReview=require("../controllers/reviews.js");


//Reviews
//Post Route
router.post("/",isLoggedIn,wrapAsync(listingReview.postReview));
  

//Post Delete Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(listingReview.destroyReview));
  
  
module.exports=router;