const express = require('express');
const router = express.Router({mergeParams:true}); // to merge params from listing and review routes
const wrapasync=require('../utils/wrapasync.js');
const Listing = require('../models/listing.js');
const { userLogedIn, isowner,validateListing } = require('../middleware.js'); 
const listingsController = require('../controllers/listing.js');
const multer  = require('multer')
const {storage}=require('../cloudconfig.js')
const upload = multer({storage})
router.get('/', wrapasync(async(req,res)=>{
    const allListings = await Listing.find({});     
    res.render("listings/index.ejs",{allListings});
}));
router
.route('/')
//index route
.get(wrapasync(listingsController.index))
//create route
.post(userLogedIn,validateListing, upload.single('listing[image]'),wrapasync(listingsController.create))

//new route
 router.get('/new', userLogedIn,listingsController.new);
 router.route('/:id')
 //show route
 .get( wrapasync(listingsController.show))
 //update route
 .put(userLogedIn,isowner,validateListing,upload.single('listing[image]'),wrapasync(listingsController.update))
 //delete route
 .delete( userLogedIn,isowner,wrapasync(listingsController.delete));
//edit route
 router.get('/:id/edit',userLogedIn,isowner ,wrapasync(listingsController.edit));


module.exports = router;