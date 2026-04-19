import { hash, compare } from "bcrypt"

const saltRounds = 10

export function hashPassword(password){
    const hashedPassword = hash(password,saltRounds)
    return hashedPassword
}

export function comparePasswords(hashedPassword,password){
    const match = compare(password,hashedPassword)
    return match
}

