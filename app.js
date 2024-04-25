require('dotenv').config()

const path = require('path')
const express = require('express')
const session = require('express-session')
const expressLayout = require('express-ejs-layouts')

const passport = require('passport')
const cookieParser = require('cookie-parser')

const MongoStore = require('connect-mongo')
const connectDB = require('./server/config/db')

const mainRouter = require('./server/routes/main')
const adminRouter = require('./server/routes/admin')

const helmet = require('helmet')
const compression = require('compression')

const app = express()
const PORT = process.env.PORT || 3000

// Connect to DB
connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(helmet())
app.use(compression())
app.use(express.static(path.join(__dirname, 'public')))
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: { expires: new Date(Date.now() + 3600000) },
  })
)
app.use(passport.session())

// Template Engine
app.use(expressLayout)
app.set('layout', path.join(__dirname, 'views/layouts/main'))
app.set('view engine', 'ejs')

// Use routes
app.use('/', mainRouter)
app.use('/admin', adminRouter)

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`)
})
