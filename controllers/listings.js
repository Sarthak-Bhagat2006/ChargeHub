const Listing = require("../Models/listing");

const axios = require('axios');
const locationIQToken = process.env.MAP_TOKEN;

module.exports.index = async (req, res) => {
    const { company, search } = req.query;

    // Start with an empty query object
    let query = {};

    // Add search condition if present
    if (search) {
        const regex = new RegExp(search, 'i'); // case-insensitive
        query.country = { $regex: regex };

    }

    // Add company filter if it's not "Trending" or null
    if (company && company !== "Trending") {
        query.company = company;
    }

    // Fetch listings based on combined query
    let allListings = await Listing.find(query);

    // Ensure all listings have a valid price
    allListings.forEach(listing => {
        if (listing.price === undefined || listing.price === null) {
            listing.price = 0;
        }
    });

    // Render the final result
    res.render("listings/index", { allListings });
};

module.exports.new = (req, res) => {

    res.render("listings/new");
}

module.exports.create = async (req, res) => {
    try {
        if (!req.body.listing.location) {
            throw new Error("Location is required");
        }

        const response = await axios.get("https://us1.locationiq.com/v1/search.php", {
            params: {
                key: locationIQToken,
                q: req.body.listing.location,
                format: "json",
                limit: 1
            }
        });

        if (!response.data || response.data.length === 0) {
            throw new Error("Invalid location");
        }

        const geometry = [
            response.data[0].lon,
            response.data[0].lat
        ];

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.coordinates = geometry;

        if (req.file) {
            newListing.image = {
                url: req.file.path,
                filename: req.file.filename
            };
        }

        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");

    } catch (err) {
        console.error("Error during geocoding:", err.message);
        req.flash("error", "Invalid location. Please enter a valid place.");
        res.redirect("/listings/new");
    }
};

module.exports.edit = async (req, res) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        let newUrl = listing.image ? listing.image.url.replace("/upload", "/upload/h_300,w_250") : "";
        return res.render("listings/edit.ejs", { listing, newUrl });
    } catch (error) {
        console.error("Error during edit:", error.message);
        req.flash("error", "Error during edit");
        return res.redirect("/listings");
    }
}

module.exports.update = async (req, res) => {
    try {
        let { id } = req.params;

        if (!req.body.listing) {
            throw new ExpressError(400, "send valid data for listing");
        }

        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

        if (req.file) {
            listing.image = { url: req.file.path, filename: req.file.filename };
            await listing.save();
        }

        req.flash("success", "Listing Updated!");
        return res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error("Error during update:", error.message);
        req.flash("error", error.message);
        return res.redirect(`/listings/${req.params.id}/edit`);
    }
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", " Listing Deleted!");

    res.redirect("/listings");
}

module.exports.show = async (req, res) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id)
            .populate({ path: "reviews", populate: { path: "author" } })
            .populate("owner");

        if (!listing) {
            req.flash("error", "Listing is not available");
            return res.redirect("/listings");
        }

        return res.render("listings/show", { listing });
    } catch (error) {
        console.error("Error during show:", error.message);
        req.flash("error", "Something went wrong");
        return res.redirect("/listings");
    }
}