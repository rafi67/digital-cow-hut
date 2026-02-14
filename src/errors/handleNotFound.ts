import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

const handleNotFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Not Found",
    errorMessage: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
  next();
};

export default handleNotFound;
