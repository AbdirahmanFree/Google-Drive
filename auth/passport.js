import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { comparePasswords } from "./password.js"
import prisma from "../db/prisma.js"

passport.use( 
    new LocalStrategy( async function (username, password, cb){
        const loweredUsername = username.toLowerCase();
        try {
            const users = await prisma.user.findMany({
                where: {
                    username: loweredUsername
                }
            });
            if(users.length == 0){
                return cb(null,false);
            }
            const user = users[0]
            const match = await comparePasswords(user.password,password);
            if(match == true){
                console.log('password check success');
                return cb(null,user);
            }
            else {
                console.log('password incorrect');
                return cb(null,false);
            }

        } catch(error){
            console.log(error)
            return cb(null,false)
        }

    }))

passport.serializeUser((user,done) => {
    done(null,user.id)
})


passport.deserializeUser(async(id, done) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                id: id
            }
        })
        const user = users[0]
        done(null,user)
    } catch(error){
        console.log(error)
        done(error)
    }
})

export default passport
