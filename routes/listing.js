const express = require("express")
const router = express.Router(); 
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../Models/listing");
const ExpressError = require("../utils/ExpressError");
const {listingSchema , reviewSchema} = require("../schema");
const listingController = require("../controllers/listings");
const {isLoggedIn, isOwner} = require("../middlewares");
const multer  = require('multer')
const {storage} = require("../cloudConfig");
const upload = multer({ storage })

const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
        if(error){
            throw new ExpressError(400,error);
        }else{
            next();
        }
}

// INDEX ROUTE
router.get("/",
    wrapAsync (listingController.index)
);

// NEW ROUTE
router.get("/new",isLoggedIn,listingController.new);

// CREATE ROUTE
router.post("/",isLoggedIn,
    
    upload.single('listing[image]'),validateListing,
     wrapAsync(listingController.create)
);



// EDIT ROUTE
router.get("/:id/edit",isLoggedIn,isOwner,
    wrapAsync (listingController.edit)
);
// UPDATE route
router.put("/:id",isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,
    wrapAsync (listingController.update)
);

//DELETE route
router.delete("/:id",isLoggedIn,isOwner,
    wrapAsync (listingController.deleteListing)
);

// SHOW ROUTE
router.get("/:id",
    wrapAsync (listingController.show)
);

module.exports = router;