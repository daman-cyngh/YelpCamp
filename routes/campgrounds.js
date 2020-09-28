var express    = require("express"),
	router     = express.Router(),
	Comment    = require("../models/comment.js"),
	Campground = require("../models/campground.js"),
    middleware = require("../middleware");



// INDEX- Show all campgrounds
router.get("/", function(req, res) {
	
	//Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds) {
		if(err){
			console.log(err.message);
		}
		else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
		}
	});
});

// CREATE- Add new campgrounds to database
router.post("/", middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newData = {name: name, price: price, image: image, description: desc, author: author};
	Campground.create(newData, function(err, newlyCreated) {
		if(err){
			console.log(err.message);
		}
		else {
			req.flash("success", "Campground created successfully");
			res.redirect("/campgrounds");			
		}
	})
});

// NEW- Show form to display a form to add new campgrounds
router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("campgrounds/new");
});

// SHOW- Shows more information about one campground
router.get("/:id", function(req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if(err){
			console.log(err.message);
		}
		else {
			res.render("campgrounds/show", {campground : foundCampground});
		}
	});
});

// EDIT- Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership,function(req, res) {
		Campground.findById(req.params.id, function(err, foundCampground){
			res.render("campgrounds/edit", {campground: foundCampground});
		});
});

// UPDATE- Update campground route 
router.put("/:id", middleware.checkCampgroundOwnership,function(req, res) {
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			//redirect to show-page
			req.flash("success", "Campground updated successfully");
			res.redirect("/campgrounds/"+req.params.id);
		}	
	});	
});

// DESTROY- Delete campground route 

router.delete("/:id", middleware.checkCampgroundOwnership,(req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
        if (err) {
            console.log(err);
        }
        Comment.deleteMany( {_id: { $in: campgroundRemoved.comments } }, (err) => {
            if (err) {
                console.log(err);
            }
			req.flash("success", "Campground deleted successfully");
            res.redirect("/campgrounds");
        });
    });
});





module.exports = router;