const express = require('express');
const router = express.Router({mergeparams:true});
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapasync.js');
const passport = require('passport');
const { saveRedirectUrl, userLogedIn } = require('../middleware.js');
const usercontroller=require('../controllers/user.js');
const user = require('../models/user.js');
const flash = require('connect-flash');
router
.route('/signup')
.get(usercontroller.getsignup) 
.post(wrapAsync(usercontroller.postsignup));
router
.route('/login')
.get( usercontroller.getlogin)
.post( saveRedirectUrl,usercontroller.postlogin);
//logout
router.get('/logout',usercontroller.logout)
module.exports = router;