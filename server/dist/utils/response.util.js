"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = successResponse;
exports.errorResponse = errorResponse;
function successResponse(res, data, status = 200, message = "Success") {
    return res.status(status).json({ success: true, message, data });
}
function errorResponse(res, message, status = 400) {
    return res.status(status).json({ success: false, error: message });
}
