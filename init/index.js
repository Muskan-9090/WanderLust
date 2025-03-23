const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const Mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("connection with database done");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(Mongo_url);
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner : "67da5f61177438097133de66"}));
    await Listing.insertMany(initData.data);
    console.log("sample data insertion done");
}

initDB();