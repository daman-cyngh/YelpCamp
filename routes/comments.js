var express    = require("express"),
	router     = express.Router({mergeParams: true}),
	Campground = require("../models/campground.js"),
	Comment    = require("../models/comment.js"),
	middleware = require("../middleware");


router.get("/new", middleware.isLoggedIn, function(req, res){
	
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new", {campground: foundCampground});
		}	
	})
	
});

router.post("/", middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else {
			Comment.create(req.body.comment, function(err, comment) {
				//add username and id to comment 
				comment.author.id = req.user._id;
				comment.author.username = req.user.username;
				//and then save comment
				comment.save();
				foundCampground.comments.push(comment);
				foundCampground.save();
				req.flash("success", "Successfully created a comment");
				res.redirect("/campgrounds/" + foundCampground._id);
			});
		}
	});
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership,function(req, res) {
	Comment.findById(req.params.comment_id, function(err, comment) {
		if(err){
			res.redirect("back");
		}
		else{
			res.render("comments/edit", {campground_id: req.params.id, comment: comment});
		}
	})
});

router.put("/:comment_id", middleware.checkCommentOwnership,function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if(err){
			res.redirect("back");
		}
		else {
			req.flash("success", "Comment modified successfully");
			res.redirect("/campgrounds/" + req.params.id);
		}
	} );
});

router.delete("/:comment_id", middleware.checkCommentOwnership,function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if(err){
			res.redirect("back");
		}
		else {
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});




module.exports = router;
