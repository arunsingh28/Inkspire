"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const response_util_1 = require("../utils/response.util");
function errorHandler(err, req, res, next) {
    console.error(err?.message);
    (0, response_util_1.errorResponse)(res, err?.message, 500);
}
