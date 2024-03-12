const ErrorHandler = (req, res) => {
    const statusCode = req.statusCode ? req.statusCode : 400;
    res.status(statusCode);

    res.json({
        status: 400,
        message: req.err,
    });
};

module.exports = {
    ErrorHandler,
};