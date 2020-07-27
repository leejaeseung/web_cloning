export const handleError = (err, req, res, next) => {
    res.send(err.message);
}