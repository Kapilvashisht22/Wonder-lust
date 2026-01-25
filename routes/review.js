const express=require('express');
var router=express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {validateReview, isLoggedIn, isReviewAuthor}= require('../middleware.js');
const methodOverride = require('method-override');

const Review = require('../models/review.js');
const Listing= require('../models/listing.js');

const{createReview,destroyReview}=require('../controllers/reviews.js');

// const validateReview = (req,res,next) =>{
//     let{error}= reviewSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map(el => el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     }else{
//         next();
//     }
// };
router.use(methodOverride('_method')); 
//reviews post route
router.post("/",
    isLoggedIn,validateReview,wrapAsync(createReview));

//Delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(destroyReview));

module.exports=router;