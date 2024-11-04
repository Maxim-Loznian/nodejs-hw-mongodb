const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    status: statusCode,
    message: "Something went wrong",
    data: err.message || "Error occurred",
  });
};

export default errorHandler;
