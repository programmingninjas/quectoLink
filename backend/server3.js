const express = require('express')
const { errorHandler } = require('./middleware/errorMiddleware')
const { loggerMiddleware } = require('./middleware/loggerMiddleware')
const dotenv = require('dotenv').config()
const colors = require('colors')
const connectDB = require('./database/db')
require('./zookeeper/zookeeper').connectZK()
const port = 5002 

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(loggerMiddleware)

app.use('/api/link',require('./routes/linkRoutes'))
app.use('/api/user',require('./routes/userRoutes'))

app.use(errorHandler)

app.listen(port,()=>console.log(`Server started on port ${port}`))
