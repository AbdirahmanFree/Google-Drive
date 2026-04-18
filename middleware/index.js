const { body, validationResult, matchedData } = require("express-validator")
const {hashPassword} = require("../auth/password.js")
const prisma = require('../app.js')


const validateSignUp = [
    body('firstname').trim()
    .matches(/^[A-Za-z]+$/)
    .isLength({max:20, min:2})
    .toLowerCase()
    .withMessage('must be between 2 and 20 characters and alphabetical')
    ,
    body('lastname').trim()
    .matches(/^[A-Za-z]+$/)
    .isLength({max:20, min:2})
    .toLowerCase()
    .withMessage('must be between 2 and 20 characters and alphabetical')
    ,
    body('username').trim()
    .isLength({max:20, min:2})
    .toLowerCase()
    .withMessage('must be between 2 and 20 characters')
    ,
    body('password').trim()
    .isLength({min:8})
    .withMessage('must be atleast 8 characters long')
]



exports.homePageGet = (req,res) => {
    res.render("index")
}

exports.signUpGet = (req,res) => {
    res.render("sign-up-form")
}

exports.signUpPost = [
    validateSignUp,
    async (req,res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            console.log(errors)
            return res.render("sign-up-form", {errors:errors})
        }
        else{
            const {firstname, lastname, username, password} = matchedData(req)
            const fullname = firstname +'_' + lastname
            const hashedPassword = await hashPassword(password)

            res.redirect("/")
        }
    }
]