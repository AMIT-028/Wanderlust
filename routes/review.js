const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapasync=require('../utils/wrapasync.js');
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const reviewcontroller=require('../controllers/review.js');
const { validateReview ,userLogedIn,isReviewAuthor} = require('../middleware.js'); // Import the validateReview middleware
// /review route
router.post('/',userLogedIn,validateReview ,wrapasync(reviewcontroller.create));
//delete review route
router.delete('/:reviewId',userLogedIn,isReviewAuthor,wrapasync(reviewcontroller.delete));
module.exports = router;