const HttpError = require("../models/errorModel");

const adminMiddleware = (req, res, next) => {
    // Check if user is authenticated (authMiddleware should run first)
    if (!req.user) {
        return next(new HttpError("Authentication required.", 401));
    }

    // Check if user is admin
    if (!req.user.isAdmin) {
        return next(new HttpError("Admin privileges required.", 403));
    }

    next();
};

module.exports = adminMiddleware;
