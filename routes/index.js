const router = require('express').Router();
// const indexController = require('../middleware');
// const passport = require('../auth/passport.js');

router.get("/", (req,res) => {
    res.render("index")
})

module.exports = router