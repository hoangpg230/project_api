require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')
const cors = require('cors')
const createError = require('http-errors')
const morgan = require('./config/morgan')
const routes = require('./routes')
require('./config/db')

const PORT = process.env.PORT || 3000
const app = express()

// morgan
app.use(morgan.successHandler)
app.use(morgan.errorHandler)

// set security HTTP headers
app.use(helmet())

// parse json request body
app.use(express.json())

// parse urlencoded request body
app.use(express.urlencoded({ extended: false }))

// sanitize request data
app.use(xss())
app.use(mongoSanitize())

// enable cors
app.use(cors())
app.options('*', cors())

app.use('/', routes)

app.use(async (req, res, next) => {
  next(createError.NotFound())
})

app.use(async (err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  })
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
