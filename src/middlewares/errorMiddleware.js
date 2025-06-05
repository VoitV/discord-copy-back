export const handleErrorWrap = (func) => async (req, res, next) => {
    try {
        await func(req, res, next);
    } catch (error) {
        next(error);
    }
};

export const handleErrorMiddleware = (
    error,
    req,
    res,
    next
  ) => {
    const statusCode = error.code || 500;
    res.status(statusCode).json({ message: error.message, code: error.code });
  };