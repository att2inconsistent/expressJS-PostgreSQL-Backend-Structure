function errorHandler(err, req, res, next) {
    console.error(err);

    const isDevelopment = process.env.NODE_ENV === 'development';

    res.status(err.status||500).json({ 
        message: err.message || 'Internal Server Error', ...(isDevelopment && { stack: err.stack })
     });
}

module.exports = errorHandler;