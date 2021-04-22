const AppError = require('./../utils/appError')

const handleJWTError = err => new AppError('Invalid token. Please log in again', 401);

const handleJWTExpiredError = err => new AppError('Your token has expired please login again', 401);

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Invalid input data ${errors.join('. ')}`
    return new AppError(message, 400)
}

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another model.`
    return new AppError(message, 400);
}

const handleCastErrorDB = err => {
    const message = `Invalide ${err.path}: ${err.value}.`
    return new AppError(message, 400);
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
      })
}
const sendErrorProd = (err, res) => {
    if(err.isOPerational){  
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      })} else {
            console.error('ERROR!!!', err)

          res.status(500).json({
              status: 'error',
              message: "Something went very wrong"
          })
      }
}



module.exports = (err, req, res, next) => {
    //console.log(err.stack)
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err, res);
    }else if (process.env.NODE_ENV === 'production'){
        let error = {...err};
        if(err.name === 'CastError') error = handleCastErrorDB(error);
        if(err.code === 11000) error = handleDuplicateFieldsDB(error);
        if(error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if(error.name === 'JsonWebTokenError') error = handleJWTError(error);
        if(error.name === 'TokenExpiredError')error = handleJWTExpiredError(error)


       sendErrorProd(err, res)
    }
    
  }