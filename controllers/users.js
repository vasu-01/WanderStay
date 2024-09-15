const User=require("../models/user");


module.exports.renderSignupform=(req,res)=>{
    res.render("users/signup.ejs");
    // res.send("form");
}
module.exports.signup=async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.flash("success","Welcome to wanderlust");
        res.redirect("/listings");
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}



module.exports.renderLoginform=(req,res)=>{
    res.render("users/login.ejs");
    // res.send("form");
}
module.exports.login=async(req,res)=>{
    req.flash("success","Welcome to wanderlust!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}


module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{  //used to logout from session
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    });
}