const express = require("express")
const router = express.Router({mergeParams:true}); 
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const {listingSchema , reviewSchema} = require("../schema");
const Review = require("../Models/reviews");
const Listing = require("../Models/listing");
const {isLoggedIn,isOwner, isAuthor} = require("../middlewares")
const reviewController = require("../controllers/reviews");


const validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}



//Review route
//post review
router.post("/",isLoggedIn, validateReview,
    wrapAsync (reviewController.postReview));

// delete review
router.delete("/:reviewId",isLoggedIn,isAuthor,
    wrapAsync(reviewController.deleteReview)
  );

module.exports = router;