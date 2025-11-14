if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express= require('express');
const app = express();
const mongoose = require('mongoose');
const path=require('path');
const methodOverride=require('method-override');
const ejsmate=require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const listingsRoutes = require('./routes/listing.js');
const reviewRoutes = require('./routes/review.js');
const userRoutes = require('./routes/user.js');
const sessionoptions={
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now()+ 7*1000 * 60 * 60 * 24, // 7 days
        maxAge: 7*1000 * 60 * 60 * 24, // 7 days
        httpOnly: true // helps to prevent XSS attacks
    }
};

app.use(session(sessionoptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, '/public')));
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error= req.flash('error');
    res.locals.currUser = req.user; // make currentUser available in all templates
    next();

});
app.use('/', userRoutes);
app.get('/demo', async (req, res) => {
    let fakeUser = new User({
        email: 'studentcom@gmail.com',
        username: 'studentcom',
    });
    let reguser = await User.register(fakeUser, 'student');
    res.send(reguser);
});
main()
    .then(()=>{
        console.log('Connected to MongoDB');
    })
    .catch((err)=>{
        console.log(err);
    });
async function main(){
   await mongoose.connect('mongodb://localhost:27017/mydatabase');
}
// app.get('/',(req,res)=>{
//     res.send("hi,i am root");
// });
// listing routes
app.use('/listings', listingsRoutes);
//review routes
app.use('/listings/:id/reviews', reviewRoutes);
//middleware
// app.all('*', (req, res, next) => {  
//     next(new ExpressError('Page Not Found', 404));
// });
app.use((err, req, res, next) => {
    let{statusCode=500,message= 'Something went wrong!' }=err;
    res.status(statusCode).render('./listings/error.ejs', {message });
    // res.status(statusCode).send(message);
})
// app.get('/testListings', async (req, res) => {
//    let sampleListing= new Listing({
//          title: 'My new Villa',
//          description: 'by the beach',
//          price: 10000,
//          location: 'kamla nagar,Agra',
//          country: 'India',
//    });
//    await sampleListing.save();
//    console.log('Sample listing saved');
//     res.send('sucessfull testing');
// });
app.listen(8080, () =>{
    console.log('Server is running on port 8080');
});

