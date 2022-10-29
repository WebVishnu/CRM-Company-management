const path = require('path');
const ErrorHandler  = require(path.join(__dirname,'../utils/errorHandler'));

module.exports = (err,req,res,next)=> {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';

    // Wrong MongoDB ID Error
    if (err.name ===  'CastError'){
        const message =  `Resource not found: ${err.path}`;
        err = new ErrorHandler(message,400);
    }

    // mongoose dulicate error
    if(err.code === 11000){
        const message =  `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message,400);
    }

    //Wrong JWT error
    if(err.name==="JsonWebTokenError"){
        const message =  `Json web token is not valid, Try Again`;
        err = new ErrorHandler(message,400);
    }

    //JWT Expired error
    if(err.name==="TokenExpiredError"){
        const message =  `This Token is Expired, Try Again`;
        err = new ErrorHandler(message,400);
    }
    
    res.status(err.statusCode).json({
        success: false,
        error:err.message
    });
}