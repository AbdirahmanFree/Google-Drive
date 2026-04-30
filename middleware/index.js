import { body, validationResult, matchedData } from "express-validator"
import { hashPassword } from  "../auth/password.js"
import prisma from '../db/prisma.js'
import supabase  from "../db/supabase.js"


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
    if(req.isAuthenticated()){
        res.redirect("/my-drive")
    }
    else{
        res.render("index", {user: req.user})
    }
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

const isAuthenticated = (req,res,next) => {
    if(req.isAuthenticated()){
        return next();
    }
    return res.status(401).send("Unauthorized")

}

const myDriveGet = async (req,res) => {
    console.log(req.params)
    co
    const children = await prisma.item.findMany({
        where: {
            parentId: folderId,
            userId: req.user.id
        }
    })
    console.log('children', children)
    res.render("my-drive", {user: req.user, folderId: req.params.folderId || null, items: children})
}

const addFilePost =  async(req,res) => {
    const userId = req.user.id;
    const uniqueName = `${Date.now()}-${req.file.originalname}`
    const filePath = `users/${userId}/${uniqueName}`
    const file = req.file.buffer
    const mimetype = req.file.mimetype
    
   try {
        const {data, error} = await supabase.storage
        .from('files')
        .upload(filePath,file, {contentType: mimetype})

        if(error){
            console.error(error)
            return res.status(500).send('storage upload failed')
        }
        else{
            await prisma.item.create({
            data: {
                userId: userId,
                type: 'file',
                filePath: filePath,
                name: req.file.originalname
            }
        })
        }
        
    } catch(error){
        console.error(error)
        return res.status(500).send('upload failed')
    }
    return res.redirect("my-drive")
    

}

const addFolderPost = async (req,res) => {
    const folderName = req.body.folder
    const userId = req.user.id
    try {
        await prisma.item.create({
            data: {
                userId: userId,
                type: 'folder',
                name: folderName,
            }
        })

    } catch(error) {
        console.error(error)
        return res.status(500).send('folder creation failed')
    }
}

export default {
    logInGet,
    signUpPost,
    signUpGet,
    homePageGet,
    logOutPost,
    isAuthenticated,
    myDriveGet,
    addFilePost,
    addFolderPost
}