const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const listingSchema = new Schema({
    title: {
        type:String,
        required:true,
    },
    description: String,
    image: { 
        filename: { type: String, default: "listing_image" },
        url: {
            type: String,
            default:"https://images.unsplash.com/photo-1723129092506-5cd0cd84decd?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set: (v) =>
                v === " " ? "https://images.unsplash.com/photo-1723129092506-5cd0cd84decd?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dc" : v,
        }
    },

    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ]
});
listingSchema.post("findOneAndDelete", async function(listing) {
    if(listing){
        await Review.deleteMany({
            _id: { $in: listing.reviews }
        });
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;