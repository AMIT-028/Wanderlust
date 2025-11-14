const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
module.exports.create=async (req, res) => {
        let listing=await Listing.findById(req.params.id);
        let newreview = new Review(req.body.review);
        newreview.author = req.user._id; // Set the author to the current user
        listing.reviews.push(newreview);

        await newreview.save();
        await listing.save();
        req.flash('success', 'New Review is Created!');
        res.redirect(`/listings/${listing._id}`);

}
module.exports.delete=async (req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Delete!');
    res.redirect(`/listings/${id}`);
};