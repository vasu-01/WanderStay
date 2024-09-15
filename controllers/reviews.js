const Listing=require("../models/listing.js");
const Review=require("../models/review.js");



module.exports.postReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    // console.log(listing);
    let newReview= new Review(req.body.review);
    // console.log(newReview);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // console.log(listing.reviews);
    req.flash("success","New review created successfully!");
    res.redirect(`/listings/${listing._id}`);

    // console.log("new review saved...");
    // res.send("new review saved...");
}

module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted successfully");
    res.redirect(`/listings/${id}`);
}