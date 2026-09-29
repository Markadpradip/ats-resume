const notFound = (req, res, next) => {
  const error = new Error(
    `Route not found: ${req.originalUrl}`
  );

  error.statusCode = 404;

  next(error);
};

// ======================================
// GLOBAL ERROR HANDLER
// ======================================

const errorHandler = (err, req, res, next) => {
  let statusCode =
    err.statusCode ||
    (res.statusCode !== 200
      ? res.statusCode
      : 500);

  let message = err.message || "Internal Server Error";

  // ======================================
  // INVALID MONGODB OBJECT ID
  // ======================================

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // ======================================
  // MONGOOSE VALIDATION ERROR
  // ======================================

  if (err.name === "ValidationError") {
    statusCode = 400;

    message = Object.values(
      err.errors
    )
      .map((error) => error.message)
      .join(", ");
  }

  // ======================================
  // DUPLICATE MONGODB KEY
  // ======================================

  if (err.code === 11000) {
    statusCode = 409;

    const field =
      Object.keys(err.keyValue || {})[0];

    message = field
      ? `${field} already exists`
      : "Duplicate value already exists";
  }

  // ======================================
  // JWT ERRORS
  // ======================================

  if (
    err.name === "JsonWebTokenError"
  ) {
    statusCode = 401;
    message = "Invalid token";
  }

  if (
    err.name === "TokenExpiredError"
  ) {
    statusCode = 401;
    message = "Token has expired";
  }

  // ======================================
  // RESPONSE
  // ======================================

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = {
  notFound,
  errorHandler,
};