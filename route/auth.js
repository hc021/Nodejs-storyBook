const express = require('express');
const router = express.Router();
const passport = require('passport');

//@desc  auth with google
//@route Get/auth/google

router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

//@desc google auth callback
//@route Get /auth/google/callback

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/dashboard')
})

//@desc Logou user
//@route /auth/logout
router.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/');
})
module.exports = router;