
const successResponse = (res, data, message = "Success", statusCode = 200, meta = {}) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    ...meta
  });
};

const errorResponse = (res, message = "Error", statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = { successResponse, errorResponse };