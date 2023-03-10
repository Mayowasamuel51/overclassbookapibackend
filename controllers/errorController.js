const AppError = require('../error/appError')
const handleCastErrorDB = err => {
    const message = 'Invalid ' + err.path + err.value
    return new AppError(message, 400)
}
const handleDuplicateFeilds = err => {
    const message = 'Duplicate fields value  please another value ';
}
const handleJWTExp = err=> new AppError('your token has expried ', 401)
const handleValidationErrordb = err => {
    const errors = Object.values(err.errors).map(el => el.message)
    const message = 'Invild input data ' + errors.join('. ');
    return new AppError(message, 400)
}
const handleJWTError = err=> new  AppError('invalid token please well ', 401)
const sendError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
    })
    console.log('this is working ')
}
const sendErrorProd = (err, res) => {
    if (err.isOpertional) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    } else {
        res.status(500).json({
            status: 'error',
            message:'something went very wonrng'
        })
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV ===   'development' ) {
       sendError(err, res)
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        if(error.name = 'CastError') error =  handleCastErrorDB(error)
        if (error.code === 11000) error = handleDuplicateFeilds(error)
        // if(error.name === 'ValidationError') error = handleValidationErrordb(error)
        if (error.name === 'JsonWebTokenError') error = handleJWTError()
        if(error.name === 'TokenExpiredError') error = handleJWTExp()
        
        sendErrorProd(error, res)
        

    }

}