var Campground = require("../models/campground"),
	Comment    = require("../models/comment");

var middlewareObject = {};

middlewareObject.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
			}
			else {
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}else {
					res.redirect("back");
				}		
			}
		});	
	} else {
		req.flash("error", "You need to logged in to that");
		res.redirect("back");
	}
}

middlewareObject.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				req.flash("error", "Campground not found");
				res.redirect("back");
			}
			else {
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}else {
					req.flash("error", "You don't have the permission to do that");
					res.redirect("back");
				}		
			}
		});	
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObject.isLoggedIn = function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
	req.flash("error", "You need to be logged in");
    res.redirect("/login");
}


module.exports = middlewareObject;