const Listing = require('../models/listing.js');

module.exports.index=async(req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index",{allListings});
};

module.exports.renderNewForm=(req,res)=> {
    res.render("listings/new",{listing:{}});

};

module.exports.showRoute=async(req,res) =>{
    const {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate('owner');
    if(!listing){
        req.flash('error',"This listing is already deleted");
        res.redirect("/listings");
    };
    // console.log(listing);
    res.render("listings/show",{listing});
    
};

module.exports.createListing=async(req,res) =>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Invalid Listing Data");
    // }
    let url=req.file.path;
    let filename=req.file.filename;
    
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash('success',"Successfully created a new listing");
    res.redirect(`/listings`);
}  ;

module.exports.renderEditForm=async(req,res) =>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
    req.flash('error',"This listing is already deleted");
    return res.redirect("/listings");
    }
    res.render("listings/edit",{listing});
};

module.exports.updateListing=async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400,"Invalid Listing Data");
    }
    const { id } = req.params;
     
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { runValidators: true });
    req.flash('success',"Successfully updated the listing");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash('success',"Successfully deleted the listing");
    res.redirect("/listings");
};