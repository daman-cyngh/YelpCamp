var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
	passport              = require("passport"),
	LocalStrategy         = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	Campground            = require("./models/campground.js"),
	Comment               = require("./models/comment.js"),
	User                  = require("./models/user.js"),
	seedDB                = require("./seeds.js"),
	methodOverride        = require("method-override"),
	flash                 = require("connect-flash");

var campgroundsRoutes = require("./routes/campgrounds.js"),
	commentsRoutes    = require("./routes/comments.js"),
	authRoutes        = require("./routes/index.js");

// seedDB();

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/yelp_camp_v4", {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(() => console.log("Connected to DB!"))
.catch(error => console.log(error.message));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


// PASSPORT CONFIGS
app.use(require("express-session")({
	secret: "My preferences are pretty clear!!",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//add middleware for passing current user to each route 
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})



// use the route modules
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);
app.use(authRoutes);

function isLoggedIn(req, res, next) { //next is the next thing that needs to be called.
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}



app.listen(process.env.PORT, process.env.IP, function() {
	console.log("The YelpCamp server has started.");
});