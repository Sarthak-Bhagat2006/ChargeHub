const User = require("../Models/user");

// Render Signup Page
module.exports.signupRender = (req, res) => {
    return res.render("users/signup");
}

// Signup / Register new user
module.exports.signin = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        // Use req.login safely
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to ChargeHub");
            return res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        return res.redirect("/signup");
    }
}

// Login existing user
module.exports.login = (req, res) => {
    req.flash("success", "Welcome to ChargeHub");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    return res.redirect(redirectUrl);
}

// Logout user
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out now");
        return res.redirect("/listings");
    });
}