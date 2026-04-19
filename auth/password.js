const bcrypt = require("bcrypt")

const saltRounds = 10

function hashPassword(password){
    const hashedPassword = bcrypt.hash(password,saltRounds)
    return hashedPassword
}

function comparePasswords(hashedPassword,password){
    const match = bcrypt.compare(password,hashedPassword)
    return match
}

module.exports = {
    hashPassword,
    comparePasswords
}