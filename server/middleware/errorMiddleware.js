// unsupported error

const notFound = (req, res, next ) => {
  const error = new Error(`NOt found - ${req.originalUrl} `)
  res.status(400)
  next(error)
}

// error middleWare
const errorHandler = (error, req,res, next) => {
  if(res.headerSent) {
    return next(error)
  }
  res.status(error.code || 500).json({ message: error.message || "An unknown error occured"})
}

module.exports = { notFound, errorHandler}