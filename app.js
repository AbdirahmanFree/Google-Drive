const express = require("express")
const path = require("node:path")
const session = require("express-session")
const pgSession = require('connect-pg-simple')(session)
const passport = require('passport')

const app = express()

app.set('views',path.join(__dirname,'views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))

