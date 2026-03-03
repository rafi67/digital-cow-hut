"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodError = (error) => {
    const statusCode = 400;
    const errors = error.issues.map((issue) => {
        return {
            path: issue.path.length ? String(issue?.path[issue.path.length - 1]) : "",
            message: issue?.message,
        };
    });
    return {
        statusCode,
        message: "Validation Error",
        errorMessages: errors,
    };
};
exports.default = handleZodError;
