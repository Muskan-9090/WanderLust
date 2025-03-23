require('dotenv').config();

const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const dbUrl = process.env.ATLAS_DB_URL;
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const usersRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

main().then(()=>{
    console.log("connection with database done");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24*7,
})
store.on("error",()=>{
    console.log("Error in mongo session store : ",err);
})
const sessionOptions = {
    store : store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() +  7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true,
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/",(req,res)=>{
//     res.send("on root page");
// })

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/demouser",async (req,res)=>{
//     let fakeUser = new User({
//         email : "abc@gmail.com",
//         username : "abc",
//     })

//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",usersRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})

app.use((err,req,res,next)=>{
    let {status = 500,message ="something wrong happened"} = err;
    res.status(status).render("listings/error.ejs",{message});
})

app.listen(port,()=>{
    console.log("app listening successfully");
})

//test a listing
// app.get("/testListings",wrapAsync(async (req,res)=>{
//     let testListing = new Listing({
//         title : "my new villa",
//         description : "a happy place :)",
//         price : 1200,
//         location : "jind,haryana",
//         country : "India",
//     })
//     testListing.save().then(()=>{
//         console.log("saved into db");
//     })
//     res.send("testing successfull");
// }))