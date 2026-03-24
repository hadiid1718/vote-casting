// unsupported error

const notFound = (req, res, next ) => {
  const error = new Error(`NOt found - ${req.originalUrl} `)
  res.status(404)
  next(error)
}

// error middleWare
const errorHandler = (error, req,res, next) => {
  if(res.headersSent) {
    return next(error)
  }

  // Normalize status code to a valid HTTP status number.
  // Note: Node/FS errors often set error.code to strings like 'ENOENT'.
  const getHttpStatus = (err) => {
    const raw = err?.code ?? err?.statusCode ?? err?.status;

    if (typeof raw === 'number' && raw >= 100 && raw <= 599) return raw;

    if (typeof raw === 'string') {
      const asNumber = Number(raw);
      if (Number.isFinite(asNumber) && asNumber >= 100 && asNumber <= 599) return asNumber;

      // Common Node error codes → sensible HTTP statuses
      if (raw === 'ENOENT') return 404;
      if (raw === 'EACCES' || raw === 'EPERM') return 403;
    }

    return 500;
  };

  const status = getHttpStatus(error);
  res.status(status).json({ message: error?.message || "An unknown error occured"})
}

module.exports = { notFound, errorHandler}