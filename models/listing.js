const mongoose = require("mongoose");
const Review = require("./review.js");
const listingSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    image : {
        url : String,
        filename : String,
    },
    price : {
        type : Number,
    },
    location : {
        type : String,
    },
    country : {
        type : String,
    },
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review",
        }
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
    geometry : {
        type: {
          type: String,
          enum: ['Point'], 
          required: true,
        },
        coordinates: {
          type: [Number],
          required: true,
        }
    },
    category : {
        type : String,
        enum : ["Trending","Mountains","Beaches","Camping","Spiritual","Lakeside","Historic","Luxury","Desert","Forest","Snowy","Wildlife"],
        required : true,
    }
})

listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
})
const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;