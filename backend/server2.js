const express = require('express')
const { errorHandler } = require('./middleware/errorMiddleware')
const dotenv = require('dotenv').config()
const colors = require('colors')
const connectDB = require('./database/db')
const port = 5001 

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:false}))

// Custom logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
  });

app.get('/', (req, res) => {
    res.send(`hello from ${port}`);
  });


app.use('/api/link',require('./routes/linkRoutes'))
app.use('/api/user',require('./routes/userRoutes'))

app.use(errorHandler)

app.listen(port,()=>console.log(`Server started on port ${port}`))
