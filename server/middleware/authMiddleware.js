// const jwt = require("jsonwebtoken");
// const HttpError = require("../models/errorModel")

// const authMiddleware = (req, res, next) => {
//     const Authorization = req.headers.Authorization || req.headers.authorization;
//     if(Authorization  && Authorization.startsWith("Bearer" )) {
//       const token = Authorization.split(" ")[1]
//       jwt.verify(token, process.env.JWT_SEC, (err, info)=> {
//           if(err) {
//             return next(new HttpError("Unauthorized Invalid token.", 403))
//           }
//           req.user = info
//           next()
//       })
//     } else {
//       return next (new HttpError("Unauthorized, No token", 403))
//     }
    
   
// };

// module.exports = authMiddleware;


const jwt = require("jsonwebtoken");
const HttpError = require("../models/errorModel");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SEC, (err, decoded) => {
            if (err) {
                return next(new HttpError("Unauthorized: Invalid token.", 403));
            }
            req.user = decoded;
            next(); // Call next() to continue processing
        });
    } else {
        return next(new HttpError("Unauthorized: No token provided.", 403));
    }
};

module.exports = authMiddleware;

