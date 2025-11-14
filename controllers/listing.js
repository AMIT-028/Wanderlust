const Listing = require('../models/listing.js');
const { copy } = require('../routes/listing.js');
module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render('listings/index.ejs',{allListing});
};
module.exports.show=async(req,res)=>{
   let {id}=req.params;
   const listing=await Listing.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('owner');
   if(!listing){
      req.flash('error' , 'Listing not found!');
      return res.redirect('/listings'); // Use redirect and return!
   }
   res.render("listings/show.ejs",{listing});
};
module.exports.new=(req, res) => {
    res.render('listings/new.ejs');
}
module.exports.create=async (req, res) => {
        let url=req.file.path;
        let filename=req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id; // Set the owner to the current user
        newListing.image={url,filename};
        await newListing.save();
        req.flash('success', 'Successfully created a new listing!');
        res.redirect('/listings');
};
module.exports.edit=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
     if(!listing){
      req.flash('error', 'Listing not found!');
      return res.redirect('/listings'); // Use redirect and return!
   }
    let copylisting=listing.image.url;
    copylisting=copylisting.replace('/upload', '/upload/h_200');
    res.render('listings/edit.ejs', {listing, copylisting});
}
module.exports.update=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== 'undefined'){
       let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
    }
    listing=await listing.save();
    req.flash('success', 'Listing Updated!');
    res.redirect(`/listings/${id}`);
};
module.exports.delete=async(req,res)=>{
    let{id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing Delete!');
    console.log(deleteListing);
    res.redirect('/listings');
};