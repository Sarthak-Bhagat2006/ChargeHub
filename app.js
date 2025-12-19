if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./Models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate')
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema");
const Review = require("./Models/reviews");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");

const listings = require("./routes/listing");
const reviews = require("./routes/reviews");
const users = require("./routes/users");
const User = require("./Models/user")
const passport = require("passport");
const LocalStrategy = require("passport-local")



const dbURL = process.env.ATLASBD_URL;

async function main() {
    await mongoose.connect(dbURL);
}
main()
    .then(() => {
        console.log("Connected to DB");
        console.log("Database name:", mongoose.connection.db.databaseName); // prints DB name
    })
    .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})

store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});


const sessionOption = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};



app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    next();
})
app.use((req, res, next) => {
    res.locals.error = req.flash("error");
    next();
})
app.use((req, res, next) => {
    res.locals.currUser = req.user;
    next();
})




// app.get("/demo",async (req,res)=>{
//     let fakeUser = new User({
//         email: "sarthak@gmail.com",
//         username:"sarthak"
//     });
//    let registerUser = await User.register(fakeUser, "password");
//    res.send(registerUser);
// })

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", users);



app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    let { statusCode = 500, message = "Something Went Wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
});


app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
