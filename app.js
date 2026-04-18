const express = require("express")
const path = require("node:path")
const expressSession = require("express-session")
const { PrismaPg } = require("@prisma/adapter-pg")
const { PrismaClient } = require("./generated/prisma/client")
const { PrismaSessionStore } = require("@quixo3/prisma-session-store")
const passport = require('passport')
const routes = require('./routes')
require('dotenv').config()

const app = express()

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({connectionString: connectionString});
const prisma = new PrismaClient({adapter: adapter});

app.set('views',path.join(__dirname,'views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))

app.use(
    expressSession({
        cookie: {
            maxAge: 1000 * 60 * 60 * 60 * 24 * 7
        },
        secret: 'a santa at nasa',
        resave: true,
        saveUninitialized: true,
        store: new PrismaSessionStore(
            prisma,
            {
                checkPeriod: 1000 *60 * 2,
                dbRecordIdIsSessionId: true,
                dbRecordIdFunction: undefined,
            }
        )
    })
)


app.use(routes)

const PORT = process.env.PORT;
app.listen(PORT,() => {
    console.log(`App is running on http://localhost:${PORT}`)
})


module.exports= prisma