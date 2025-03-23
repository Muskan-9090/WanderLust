const Listing = require("../models/listing.js");

module.exports.index = async (req,res)=>{
    let allListings = await Listing.find();
    const selectedCategory = req.query.q || undefined;
    const searchLocation = req.query.loc || undefined;
    let filteredListings = allListings;
    if (selectedCategory) {
        filteredListings = allListings.filter(listing => listing.category === selectedCategory);
    }
    if(searchLocation){
        filteredListings = allListings.filter(listing => (
            listing.location.toLowerCase().includes(searchLocation.toLowerCase()) ||
            listing.country.toLowerCase().includes(searchLocation.toLowerCase())
        ));
    }
    if(filteredListings.length === 0){
        req.flash("error","No results found.Try exploring something else!");
    }
    res.render("listings/index.ejs",{allListings:filteredListings,selectedCategory});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path : "reviews",populate : {path : "author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requests for doesn't exist!");
        res.redirect("/listings");
    }
    else{
        res.render("listings/show.ejs",{listing});
    }
};

module.exports.createListing = async(req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    let listing = new Listing({...req.body.listing});
    listing.owner = req.user._id;
    listing.image = {url,filename};
    listing.geometry.coordinates = req.body.listing.geometry.coordinates; 
    req.flash("success","Listing created!");
    await listing.save();
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requests for doesn't exist!");
        res.redirect("/listings");
    }
    else{
        let originalUrl = listing.image.url;
        originalUrl = originalUrl.replace("/upload","/upload/w_250");
        res.render("listings/edit.ejs",{listing,originalUrl});
    }
};

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
};

module.exports.editListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    listing.geometry.coordinates = req.body.listing.geometry.coordinates;
    req.flash("success","Listing updated!");
    res.redirect(`/listings/${id}`);
};