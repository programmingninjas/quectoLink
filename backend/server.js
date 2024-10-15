const express = require('express');
const { errorHandler } = require('./middleware/errorMiddleware');
const { loggerMiddleware } = require('./middleware/loggerMiddleware');
const { metricsMiddleware, metricsEndpoint } = require('./middleware/metricsMiddleware');
const dotenv = require('dotenv').config();
const colors = require('colors');
const connectDB = require('./database/db');
const cors = require('cors');
const { removeToken } = require('./zookeeper/zookeeper');
require('./zookeeper/zookeeper').connectZK();
const port = process.env.PORT;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(cors());

app.use(loggerMiddleware);
app.use(metricsMiddleware);

app.get('/metrics', metricsEndpoint);
app.use('/api/link',require('./routes/linkRoutes'));
app.use('/api/user',require('./routes/userRoutes'));

app.get('/api/deleteToken',async (req,res)=>{
    await removeToken();
    res.status(200).json({message:"Token Removed"});
});

app.use(errorHandler);

app.listen(port,()=>console.log(`Server started on port ${port}`));
