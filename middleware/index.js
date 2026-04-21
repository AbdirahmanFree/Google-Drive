import { body, validationResult, matchedData } from "express-validator"
import { hashPassword } from  "../auth/password.js"
import prisma from '../db/prisma.js'


const validateSignUp = [
    body('firstname').trim()
    .matches(/^[A-Za-z]+$/)
    .isLength({max:20, min:2})
    .toLowerCase()
    .withMessage('First name must be between 2 and 20 characters and alphabetical')
    ,
    body('lastname').trim()
    .matches(/^[A-Za-z]+$/)
    .isLength({max:20, min:2})
    .toLowerCase()
    .withMessage('Last name must be between 2 and 20 characters and alphabetical')
    ,
    body('username').trim()
    .isLength({max:20, min:2})
    .toLowerCase()
    .withMessage('Username must be between 2 and 20 characters')
    ,
    body('password').trim()
    .isLength({min:8})
    .withMessage(' Password must be at least 8 characters long')
]



const homePageGet = (req,res) => {
    res.render("index", {user: req.user})
}

const signUpGet = (req,res) => {
    res.render("sign-up-form", {errors: []})
}

const signUpPost = [
    validateSignUp,
    async (req,res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            console.log(errors.errors)
            return res.render("sign-up-form", {errors:errors.errors})
        }
        else{
            const {firstname, lastname, username, password} = matchedData(req)
            const fullname = firstname + '_' + lastname
            const hashedPassword = await hashPassword(password)
            try{
                const user = await prisma.user.create({
                    data: {
                        username: username,
                        fullname: fullname,
                        password: hashedPassword
                    }
                })
                res.redirect("/")
                return user
                

            } catch(error){
                console.log('error inserting user')
                console.log(error)
            }
            
        }
    }
]

const logInGet = (req,res) => {
    res.render("log-in-form")
}

const logOutPost = (req,res) => {
    req.logOut((err) => {
        if(err){return next(err)}
        req.session.destroy((error) => {
            if(error){return next(error)}
            res.clearCookie('connect.sid')
            res.redirect("/")
        })
    })
}

export default {
    logInGet,
    signUpPost,
    signUpGet,
    homePageGet,
    logOutPost
}