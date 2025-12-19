const User = require("../Models/user");

//signupRender

module.exports.signupRender = (req, res) => {
    return res.render("users/signup");
}

module.exports.signin = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to ChargeHub");
            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}



module.exports.login = (req, res) => {
    req.flash('success', 'Welcome to ChargeHub');
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}




module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "You are logout now");
        res.redirect("/listings");
    });
}



