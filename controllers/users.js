const User = require("../models/user.js");

module.exports.signup = async (req,res)=>{
    try{
        let {username,email,password} = req.body;
        let newUser = new User({username,email});
        await User.register(newUser,password);
        req.login(newUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to WanderLust");
            res.redirect("/listings");
        })
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};

module.exports.loginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.signupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.login = async (req,res,next)=>{
    req.flash("success","Welcome back to WanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
};