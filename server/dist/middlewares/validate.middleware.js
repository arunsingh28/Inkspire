"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePayload = void 0;
const validatePayload = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const errorMessages = {};
        result.error.errors.forEach((error) => {
            errorMessages[error.path[0]] = error.message;
        });
        res.status(400).json({
            success: false,
            error: errorMessages,
        });
        return;
    }
    next();
};
exports.validatePayload = validatePayload;
