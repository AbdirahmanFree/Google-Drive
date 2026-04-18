const bcrypt = require("bcrypt")

const saltRounds = 10

function hashPassword(password){
    const hashedPassword = bcrypt.hash(password,saltRounds)
    return hashedPassword
}

module.exports = {
    hashPassword
}