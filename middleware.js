const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

const isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","Please login first!");
        return res.redirect("/login");
    }
    next();
}
const saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
const isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
const isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You did not create this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}
const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

const getCoordinates = async (req,res,next)=>{
    let location = req.body.listing.location;
    const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
    const response = await fetch(geoUrl);
    const data = await response.json();
    let coordinates = [parseFloat(data[0].lon), parseFloat(data[0].lat)];
    req.body.listing.geometry = { type: "Point", coordinates: coordinates };
    next();
}
module.exports = {isLoggedIn,saveRedirectUrl,isOwner,validateListing,validateReview,isReviewAuthor,getCoordinates};