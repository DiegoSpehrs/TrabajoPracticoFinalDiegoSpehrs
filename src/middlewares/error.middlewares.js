export const errorMiddleware = (error, req, res, next) => {
    res.send({
        status: 'error',
        messages: error.message
    });
};