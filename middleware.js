const Listing = require('./models/listing');
const {listingschema,reviewschema} = require('./schema.js');
const ExpressError=require('./utils/expresserror.js');
const Review = require('./models/review');
const userLogedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // Store the original URL
        req.flash('error', 'You must be logged in to do that!');
        return res.redirect('/login');
    }
    next();
};

const saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl;
    }
    next();
};
const isowner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    // Check if the logged-in user is the owner of the listing
    if (!listing.owner.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to do that!');
        return res.redirect(`/listings/${id}`);
    }
    next();
};
const isReviewAuthor = async (req, res, next) => {
    let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    // Check if the logged-in user is the owner of the listing
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash('error', 'You are not authorized to do that!');
        return res.redirect(`/listings/${id}`);
    }
    next();
};
module.exports = { userLogedIn, saveRedirectUrl,isowner,isReviewAuthor };
//server side validation using Joi


//middleware for validating listing data
module.exports.validateListing=(req,res,next)=>{
    let {error} = listingschema.validate(req.body);
    if (error) {
        let msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}
//middleware for validating review data
module.exports.validateReview=(req,res,next)=>{
    let {error} = reviewschema.validate(req.body);
    if (error) {
        let msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}
