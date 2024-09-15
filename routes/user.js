const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");

const UserController=require("../controllers/users.js");


router.route("/signup")
//route to render the signup details
.get(UserController.renderSignupform)
//route to post save the signup data
.post(wrapAsync(UserController.signup));



router.route("/login")
//route to render login  form
.get(UserController.renderLoginform)
//route to authenticate login data
.post(saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",failureFlash:true,
}),
UserController.login);

//route to logout
router.get("/logout",UserController.logout);
module.exports=router;