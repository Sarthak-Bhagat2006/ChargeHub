const express = require("express")
const router = express.Router({mergeParams:true}); 
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const passport = require("passport");

const User = require("../Models/user"); 
const userController = require("../controllers/users")
const{saveRedirectUrl} = require("../middlewares")



router.get("/signup",userController.signupRender);

router.post("/signup",wrapAsync (userController.signin))

router.get("/login",(req,res)=>{
    return res.render("users/login");
});



router.post(
    '/login',
    saveRedirectUrl,
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: true,
    }),
    userController.login
  );
  
    router.get("/logout",userController.logout);

module.exports = router;