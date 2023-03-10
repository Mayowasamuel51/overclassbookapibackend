const express = require('express')
const app = express()
const mongoose = require('mongoose');
const path = require('path');


const bookroutes = require('./routes/booksroutes');
const authorroutes = require('./routes/authorroutes');
const employee = require('./routes/employess')

// global error 
const global = require('./controllers/errorController')

// cors
const cors = require('cors')
app.use(cors())



app.use(express.json())
app.use(express.urlencoded({ extended: true }));
const dotenv = require('dotenv')
const dotenvb = require('dotenv').config();

mongoose.connect(process.env.MYDATABASE).then((data) => {
    console.log('DATABASE IS WORKING.........')
}).catch((err) => {
    console.log(err)
})    

app.use('/api/v1', employee)
app.use('/api/v1', bookroutes);
app.use('/api/v1', authorroutes);


// use global error
app.use(global)

/// used for error handling  ...  used below the routes  
app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'url not found ',
        message: 'CAN T FIND URL ' + req.originalUrl
    })
    const err = new Error('cant find this url');
    err.status = 'fail';
    err.statusCode = 404;
    // next(new AppError('cant find this url', 404))
})


app.listen(8000, () => {
    console.log('server is running')
})