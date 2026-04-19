import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { comparePasswords } from "./password.js"
import prisma from "../db/prisma.js"

await user.findMany().then(response => {
    console.log(response)
})

