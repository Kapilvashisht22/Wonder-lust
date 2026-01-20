const express=require('express');
const router=express.Router();
const {listingSchema}= require('../schema.js');
const {reviewSchema}= require('../schema.js');

const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');

const validateListing = (req,res,next) =>{
    let{error}= listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

// listings route get request
router.get("/",wrapAsync(async(req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index",{allListings});
})
);

//New route
router.get("/new",(req,res)=> {

    res.render("listings/new",{listing:{}});

});

//show route
router.get("/:id",wrapAsync(async(req,res) =>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash('error',"This listing is already deleted");
        res.redirect("/listings");
    };
    res.render("listings/show",{listing});
}));


//create post /listings route
router.post("/",
    validateListing,wrapAsync(async(req,res) =>{
    if(!req.body.listing){
        throw new ExpressError(400,"Invalid Listing Data");
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash('success',"Successfully created a new listing");
    res.redirect(`/listings`);
}  ) );


//Edit route
router.get("/:id/edit",wrapAsync(async(req,res) =>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
    req.flash('error',"This listing is already deleted");
    return res.redirect("/listings");
    }
    res.render("listings/edit",{listing});
}));
// update route
router.put("/:id", wrapAsync(async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400,"Invalid Listing Data");
    }
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { runValidators: true });
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash('success',"Successfully deleted the listing");
    res.redirect("/listings");
}));
module.exports=router;
