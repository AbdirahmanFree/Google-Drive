import express, { urlencoded } from "express"
import path from "node:path"
import { fileURLToPath } from "node:url"
import prisma from './db/prisma.js'
import { PrismaSessionStore } from "@quixo3/prisma-session-store"
import expressSession from "express-session"
import passport from './auth/passport.js'
import router from './routes/index.js'
import dotenv from "dotenv";
dotenv.config()

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.set('views',path.join(__dirname,'views'))
app.set('view engine', 'ejs')
app.use(urlencoded({extended: true}))

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

app.use(passport.initialize())
app.use(passport.session())


app.use(router)

const PORT = process.env.PORT;
app.listen(PORT,() => {
    console.log(`App is running on http://localhost:${PORT}`)
})


