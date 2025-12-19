const Listing = require("./Models/listing");
const Review = require('./Models/listing');
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        
        req.session.redirectUrl = req.originalUrl;
        
        req.flash("error", "You must be logged in to create new Listing");
        return res.redirect("/login");
    }
    
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
      res.locals.redirectUrl = req.session.redirectUrl;
      console.log("User NOT authenticated. Saving redirect URL:", req.session.redirectUrl);

    }
    next(); 
  };

  module.exports.isOwner = async(req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
  };
  module.exports.isAuthor = async (req, res, next) => {
    try {
      const { id, reviewId } = req.params;
      
      // 1. Find review with author population
      const review = await Review.findById(reviewId).populate('author');
      if (!review) {
        req.flash('error', 'Review not found');
        return res.redirect(`/listings/${id}`);
      }
  
      // 2. Check author exists
      if (!review.author) {
        req.flash('error', 'This review has no owner');
        return res.redirect(`/listings/${id}`);
      }
  
      // 3. Verify ownership
      if (!review.author._id.equals(res.locals.currUser._id)) {
        req.flash('error', 'Permission denied');
        return res.redirect(`/listings/${id}`);
      }
  
      // Store review for downstream middleware
      req.review = review;
      next();
    } catch (err) {
      req.flash('error', 'Authorization check failed');
      res.redirect('back');
    }
  };