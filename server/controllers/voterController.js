const voterModel = require("../models/voterModel");
const HttpError = require("../models/errorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")


// ========== REGISTER VOTER
// POST: api/voters/register
//UNPROTECTED
const registerVoter = async (req, res, next) => {
  try {
    const { fullName, email, password, password2 } = req?.body;
    if (!fullName || !email || !password || !password2) {
      return next(new HttpError("Fill all the fields", 422));
    }
    // email to lowercase
    const newEmail = email.toLowerCase();
    // check if email already exist
    const existEmail = await voterModel.findOne({ email: newEmail });

    if (existEmail) {
      return next(new HttpError("Email Already exist", 422));
    }
    // password length === 6+ char
    if ((password.trim().length) < 6) {
      return next(
        new HttpError("Password length must be greater than 6 aur 6!", 422)
      );
    }
    // password === password2
    if (password !== password2) {
      return next(new HttpError("Passowrd don't match", 422));
    }

    //Hashing passowrd
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // No user/voter should be admin except this one

    let isAdmin = false;

    if (newEmail === "iitadmin@gmail.com") {
      isAdmin = true;
    }
    // save the user/voter.admin in data base

    const newVoter = await voterModel.create({
      fullName,
      email: newEmail,
      password: hashedPassword,
      isAdmin,
    });
    res.status(201).json(`Voter ${fullName} created successfully!`)
  } catch (error) {
    return next(new HttpError("Voter registration failed.", 422));
  }
};




// ======================== GENERATING TOKEN =========================
// ======================== GENERATING TOKEN =========================
// ======================== GENERATING TOKEN =========================
const generateToken = (payload) => {
  // Extend token expiration to 7 days for better user experience
  const token = jwt.sign(payload, process.env.JWT_SEC, { expiresIn: "7d"})
  return token;
}

const generateRefreshToken = (payload) => {
  // Refresh token valid for 30 days
  const refreshToken = jwt.sign(payload, process.env.JWT_SEC, { expiresIn: "30d"})
  return refreshToken;
}

// ========== LOGIN VOTER
// POST: api/voters/login
//UNPROTECTED
const loginVoter = async (req, res, next) => {
  try {

    const { email, password} = req?.body
    if(!email || !password) {
      return next(new HttpError("Fill all the fields.", 422))
    }
    const newEmail = email.toLowerCase();
    const voter = await voterModel.findOne({ email: newEmail});
    if(!voter) {
       return next(new HttpError("No user exist!", 422))
      }
      // compare password

      const comparePass =  await bcrypt.compare(password, voter.password)
      if(!comparePass) {
        return next(new HttpError("Invalid credentials",422))
      }
      const { _id: id, isAdmin, votedElection } = voter;
      const token = generateToken({ id, isAdmin})
      const refreshToken = generateRefreshToken({ id, isAdmin})
      res.json({ token, refreshToken, id, isAdmin, votedElection})


    
  } catch (error) {
    return next(new HttpError("Login Failed. Please check email or password. ", 422))
  }
};
// ========== GET VOTER
// POST: api/voters/:ID
//PROTECTED
const getVoter = async (req, res, next) => {
  
  try {
     const { id } = req.params

     const getVoter = await voterModel.findById(id).select("-password")
     res.json(getVoter)
  } catch (error) {
    return next(new HttpError("Voter not found..", 404))
  }
};

// ========== REFRESH TOKEN
// POST: api/voters/refresh-token
//UNPROTECTED
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return next(new HttpError("Refresh token is required", 422));
    }
    
    // Verify refresh token
    jwt.verify(refreshToken, process.env.JWT_SEC, (err, decoded) => {
      if (err) {
        return next(new HttpError("Invalid refresh token", 403));
      }
      
      const { id, isAdmin } = decoded;
      const newToken = generateToken({ id, isAdmin });
      const newRefreshToken = generateRefreshToken({ id, isAdmin });
      
      res.json({ 
        token: newToken, 
        refreshToken: newRefreshToken,
        id, 
        isAdmin 
      });
    });
  } catch (error) {
    return next(new HttpError("Token refresh failed", 422));
  }
};

module.exports = { registerVoter, loginVoter, getVoter, refreshToken };
