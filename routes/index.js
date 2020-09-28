var express  = require("express"),
	router   = express.Router(),
	passport = require("passport"),
	User     = require("../models/user.js");

router.get("/", function(req, res) {
	res.render("landing");
});

router.get("/register", function(req, res) {
	res.render("register");
});

router.post("/register", function(req, res) {
	User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
		if(err){
			req.flash("error", err.message);
			return res.render("register");
		}
		else {
			passport.authenticate("local")(
				req, res, function(){
					req.flash("success","Welcome " + user.username);
					res.redirect("/campgrounds");
				});
		}
	});
});

router.get("/login", function(req, res) {
	res.render("login");
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req, res) {
	
});

router.get("/logout", function(req, res){
    // res.send("TESTING");
    req.logout(); //logs them out via passport
	req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;