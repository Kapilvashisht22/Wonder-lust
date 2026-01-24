const express=require('express');
const router=express.Router();

const{isLoggedIn, isOwner,validateListing}=require('../middleware.js');


const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');

// const validateListing = (req,res,next) =>{
//     let{error}= listingSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map(el => el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     }else{
//         next();
//     }
// };

// listings route get request
router.get("/",wrapAsync(async(req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index",{allListings});
})
);

//New route
router.get("/new",isLoggedIn,(req,res)=> {
    res.render("listings/new",{listing:{}});

});

//show route
router.get("/:id",wrapAsync(async(req,res) =>{
    const {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate('owner');
    if(!listing){
        req.flash('error',"This listing is already deleted");
        res.redirect("/listings");
    };
    console.log(listing);
    res.render("listings/show",{listing});
    
}));


//create post /listings route
router.post("/",
    validateListing,wrapAsync(async(req,res) =>{
    if(!req.body.listing){
        throw new ExpressError(400,"Invalid Listing Data");
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash('success',"Successfully created a new listing");
    res.redirect(`/listings`);
}  ) );


//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async(req,res) =>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
    req.flash('error',"This listing is already deleted");
    return res.redirect("/listings");
    }
    res.render("listings/edit",{listing});
}));
// update route
router.put("/:id",isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400,"Invalid Listing Data");
    }
    const { id } = req.params;
     
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { runValidators: true });
    req.flash('success',"Successfully updated the listing");
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash('success',"Successfully deleted the listing");
    res.redirect("/listings");
}));
module.exports=router;
