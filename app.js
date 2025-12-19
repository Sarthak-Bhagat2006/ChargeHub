if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/user");

const listings = require("./routes/listing");
const reviews = require("./routes/reviews");
const users = require("./routes/users");

const dbURL = process.env.ATLASBD_URL;


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


async function main() {
    await mongoose.connect(dbURL);
    console.log("Connected to DB");
    console.log("Database name:", mongoose.connection.db.databaseName);

    // ✅ CREATE STORE AFTER DB CONNECTS
    const store = MongoStore.create({
        client: mongoose.connection.getClient(),
        crypto: {
            secret: process.env.SECRET,
        },
        touchAfter: 24 * 3600,
    });

    store.on("error", (err) => {
        console.log("SESSION STORE ERROR", err);
    });

    app.use(
        session({
            store,
            secret: process.env.SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            },
        })
    );

    app.use(flash());


    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());


    app.use((req, res, next) => {
        res.locals.success = req.flash("success");
        res.locals.error = req.flash("error");
        res.locals.currUser = req.user;
        next();
    });


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
        if (res.headersSent) return next(err);
        const { statusCode = 500, message = "Something Went Wrong!" } = err;
        res.status(statusCode).render("error.ejs", { message });
    });

    app.listen(8080, () => {
        console.log("Server is listening on port 8080");
    });
}

main().catch((err) => {
    console.error("Startup Error:", err);
});