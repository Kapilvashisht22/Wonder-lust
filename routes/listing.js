const express=require('express');
const router=express.Router();

const{isLoggedIn, isOwner,validateListing}=require('../middleware.js');

const {index,deleteListing, renderNewForm,updateListing,renderEditForm, showRoute, createListing}=require('../controllers/listing.js');

const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const multer=require('multer');
const {storage}=require('../cloudConfig.js');
const upload =multer({storage});






router.route("/")
    .get(wrapAsync(index))
     .post(
    upload.single('listing[image]'),validateListing,wrapAsync(createListing ))

   
        
  

//New route
router.get("/new",isLoggedIn,renderNewForm);

//show route


router.route("/:id")
    .get(wrapAsync(showRoute))
      .put(isLoggedIn, isOwner, wrapAsync(updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(deleteListing))


//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(renderEditForm));


// update route

//delete route
;


module.exports=router;
