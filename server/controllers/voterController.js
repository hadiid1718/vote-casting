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
  const token = jwt.sign(payload, process.env.JWT_SEC, { expiresIn: "1d"})
  return token;
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
      res.json({ token, id, isAdmin, votedElection})


    
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

module.exports = { registerVoter, loginVoter, getVoter };
