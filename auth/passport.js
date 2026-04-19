const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const { comparePasswords } = require("./password.js")
const prisma = require("../db/prisma.js")

await prisma.user.findMany().then(response => {
    console.log(response)
})

