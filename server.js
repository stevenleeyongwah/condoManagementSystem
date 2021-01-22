// Import library
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const config = require('config')

// Import routes
const unitRouter = require('./routes/unit')
const visitorRouter = require('./routes/visitor')
const visitorLogRouter = require('./routes/visitorLog')

// Configuration
const app = express()
const port = process.env.PORT || 4000
const mongoURL = config.get('mongoURL')
const db = mongoose.connection

// Use middleware here
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Connect to database
mongoose.connect(mongoURL, { useNewUrlParser: true })
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

// Listening to incoming request
app.use('/unit', unitRouter)
app.use('/visitor', visitorRouter)
app.use('/visitorLog', visitorLogRouter)
app.use('/', (req, res) => {
    res.render('index')
})

// Setup nodejs server
app.listen(port, () => console.log(`Server is running at ${port}`))