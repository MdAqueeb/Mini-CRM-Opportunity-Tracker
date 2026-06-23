// --------------------
// 404 - route not found
// --------------------
export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
};

// --------------------
// Centralized error handler
// Any error passed to next(err) lands here, returning a
// consistent JSON shape with the right status code.
// --------------------
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Log for debugging (centralized exception handling)
  console.error(`[ERROR] ${req.method} ${req.originalUrl} →`, err.message);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Server error"
  });
};
