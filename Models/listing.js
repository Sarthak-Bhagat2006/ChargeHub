const mongoose = require("mongoose");
const Review = require("./reviews");
const { required } = require("joi");


const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
        require: true,
    },
    image: {
        url: String,
        filename: String
    },
    phoneNo: {
        type: String,
        required: true
    },
    price: {
        type: Number,

    },
    location: {
        type: String,
        require: true,
    },
    country: {
        type: String,
        require: true,
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    company: {
        type: String,
        enum: ["BMW", "MG", "Mahindra", "TATA", "Mercedes-Benz", "Audi", "OLA", "Tesla", "Volkswagen", "Hyundai", "Skoda", "KIA"],
        required: true,
    },
    coordinates: {
        type: [Number],
        required: true
    }


});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })
    }
});

const Listing = mongoose.model("Listing", listingSchema)

module.exports = Listing;

