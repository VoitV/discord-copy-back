export const handleErrorWrap = (func) => async (req, res, next) => {
try {
    await func(req, res, next);
} catch (error) {
    next(error);
}
};

export class HttpError extends Error {
    constructor(message, statusCode = 500) {
      super(message); 
      this.name = 'HttpError'; 
      this.statusCode = statusCode;
    }
  }
  
  export const handleErrorMiddleware = (error, req, res, next) => {
    if (error instanceof HttpError) {
      res.statusCode = error.statusCode;
      res.json({ message: error.message, statusCode: error.statusCode });
    } else {
      res.statusCode = 500;
      res.json({ message: 'Internal server error', statusCode: 500 });
    }
  };