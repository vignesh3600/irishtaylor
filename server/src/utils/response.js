export const buildErrObject = (code = 500, message = 'Something went wrong') => ({
  code,
  message
});

export const sendSuccess = (res, result = null, message = 'Success', status = 200) =>
  res.status(status).json({
    success: true,
    result,
    message
  });

export const handleError = (res = {}, err = {}) => {
  const statusCode = Number.isInteger(err.code) ? err.code : err.status || err.statusCode || 500;
  const message = Array.isArray(err.message) ? err.message[0]?.msg : err.message;

  if (process.env.NODE_ENV === 'development') {
    console.log(err);
  }

  return res.status(statusCode).json({
    success: false,
    result: null,
    message: message || 'Something went wrong'
  });
};
