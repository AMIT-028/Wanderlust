const User = require('../models/user.js');
const passport = require('passport');
const flash = require('connect-flash');
module.exports.getsignup=(req, res) => {
    res.render('user/signup.ejs');
};
module.exports.postsignup=async (req, res) => {
    try{
        let {username, email, password } = req.body;
        const newUser = new User({ username, email });
        await User.register(newUser, password);
        req.login(newUser, (err) => {
            if (err){
                return next(err);
            }else{
                req.flash('success', 'Welcome to Wanderlust');
                res.redirect('/listings');
            }
        })
    }catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
       
};
module.exports.getlogin=(req, res) => {
    res.render('user/login.ejs');
};
module.exports.postlogin= (req, res, next) => {
    passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }, (err, user, info) => {
        if (err) {
            return next(err); 
        }
        if (!user) { 
            req.flash('error', 'Invalid username or password');
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                 return next(err); 
            }
            req.flash('success', 'Welcome back to Wanderlust');
            res.redirect(res.locals.redirectUrl || '/listings');
        });
    })(req, res, next);
};

module.exports.logout=(req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye! Come back soon!');
        res.redirect('/listings');
    });
};