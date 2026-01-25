const Review = require('../models/review.js');
const Listing= require('../models/listing.js');

module.exports.createReview=async(req,res) =>{
        // console.log(req.params.id);
    let listings=await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listings.reviews.push(newReview._id);

    await newReview.save();
    await listings.save();
    req.flash('success',"Successfully added a new review");
    res.redirect(`/listings/${listings._id}`);
    
};

module.exports.destroyReview=async(req,res) =>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findById(reviewId);
    await Review.findByIdAndDelete(reviewId);
    req.flash('success',"Successfully deleted the review");
    res.redirect(`/listings/${id}`);
};