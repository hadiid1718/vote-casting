const voterModel = require("../models/voterModel");
const HttpError = require("../models/errorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ========== REGISTER VOTER
// POST: api/voters/register
//UNPROTECTED
const registerVoter = async (req, res, next) => {
  try {
    const { fullName, email, password, password2 } = req?.body;
    
    // Basic field validation - only require admin fields
    if (!fullName || !email || !password || !password2) {
      return next(new HttpError("Fill all required fields (Name, Email, Password, Confirm Password)", 422));
    }
    
    // email to lowercase
    const newEmail = email.toLowerCase();
    
    // Restrict admin registration to only the official admin email
    if (newEmail !== process.env.ADMIN_EMAIL) {
      return next(new HttpError("Admin registration is only allowed for the official admin email", 422));
    }
    
    // check if email already exist
    const existEmail = await voterModel.findOne({ email: newEmail });
    if (existEmail) {
      return next(new HttpError("Admin email already exists. Only one admin account is allowed.", 422));
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

    // This registration endpoint is for admin-only registration
    const isAdmin = true;
    
    // Generate a unique admin identifier
    const adminId = `ADMIN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create admin voter data object
    const voterData = {
      studentId: adminId,
      fullName,
      email: newEmail,
      password: hashedPassword,
      isAdmin,
      votedElection: []
    };
    
    const newVoter = await voterModel.create(voterData);
    res.status(201).json(`Administrator ${fullName} created successfully!`)
  } catch (error) {
    return next(new HttpError("Administrator registration failed.", 422));
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
    const { studentId, email, password } = req?.body;
    
    // Check if password is provided
    if (!password) {
      return next(new HttpError("Password is required.", 422));
    }
    
    // Check if either studentId or email is provided
    if (!studentId && !email) {
      return next(new HttpError("Either Student ID or Email is required.", 422));
    }
    
    let voter;
    let searchCriteria = {};
    
    if (email) {
      // Admin login with email
      const newEmail = email.toLowerCase();
      searchCriteria = { email: newEmail };
      voter = await voterModel.findOne(searchCriteria);
      
      if (!voter) {
        return next(new HttpError("No admin account found with this email!", 422));
      }
      
      // Check if the user trying to login with email is actually an admin
      if (!voter.isAdmin) {
        return next(new HttpError("Email login is only available for admin accounts. Please use Student ID.", 422));
      }
    } else if (studentId) {
      // Student login with studentId
      searchCriteria = { studentId };
      voter = await voterModel.findOne(searchCriteria);
      
      if (!voter) {
        return next(new HttpError("No student found with this Student ID!", 422));
      }
    }
    
    // Compare password
    const comparePass = await bcrypt.compare(password, voter.password);
    if (!comparePass) {
      return next(new HttpError("Invalid credentials", 422));
    }
    
    const { _id: id, isAdmin, votedElection } = voter;
    const token = generateToken({ id, isAdmin });
    const refreshToken = generateRefreshToken({ id, isAdmin });
    
    res.json({ token, refreshToken, id, isAdmin, votedElection });
    
  } catch (error) {
    return next(new HttpError("Login Failed. Please check your credentials.", 422));
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

// ========== ADD STUDENT (Admin Only)
// POST: api/voters/add-student
// PROTECTED (Admin Only)
const addStudent = async (req, res, next) => {
  try {
    const { studentId, fullName, email, department, departmentCode, year, password } = req.body;
    
    if (!studentId || !fullName || !email || !password) {
      return next(new HttpError("Please provide studentId, fullName, email, and password", 422));
    }

    // Check if student ID already exists
    const existingStudentId = await voterModel.findOne({ studentId });
    if (existingStudentId) {
      return next(new HttpError("Student ID already exists", 422));
    }

    // Check if email already exists
    const newEmail = email.toLowerCase();
    const existEmail = await voterModel.findOne({ email: newEmail });
    if (existEmail) {
      return next(new HttpError("Email already exists", 422));
    }

    // Password validation
    if (password.trim().length < 6) {
      return next(new HttpError("Password must be at least 6 characters long", 422));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new student
    const newStudent = await voterModel.create({
      studentId,
      fullName,
      email: newEmail,
      password: hashedPassword,
      department: department || '',
      departmentCode: departmentCode || '',
      year: year || '',
      isAdmin: false,
    });

    // Return student data without password
    const { password: _, ...studentData } = newStudent.toObject();
    res.status(201).json({ 
      message: `Student ${fullName} added successfully!`,
      student: studentData
    });
  } catch (error) {
    return next(new HttpError("Failed to add student", 422));
  }
};

// ========== GET ALL STUDENTS (Admin Only)
// GET: api/voters/students
// PROTECTED (Admin Only)
const getAllStudents = async (req, res, next) => {
  try {
    const students = await voterModel.find({ isAdmin: false }).select("-password").sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    return next(new HttpError("Failed to fetch students", 500));
  }
};

// ========== UPDATE STUDENT (Admin Only)
// PATCH: api/voters/students/:id
// PROTECTED (Admin Only)
const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { studentId, fullName, email, department, departmentCode, year } = req.body;

    const student = await voterModel.findById(id);
    if (!student) {
      return next(new HttpError("Student not found", 404));
    }

    if (student.isAdmin) {
      return next(new HttpError("Cannot update admin user through this endpoint", 403));
    }

    // Check if new studentId is already taken by another student
    if (studentId && studentId !== student.studentId) {
      const existingStudentId = await voterModel.findOne({ studentId, _id: { $ne: id } });
      if (existingStudentId) {
        return next(new HttpError("Student ID already exists", 422));
      }
    }

    // Check if new email is already taken by another student
    if (email && email.toLowerCase() !== student.email) {
      const newEmail = email.toLowerCase();
      const existEmail = await voterModel.findOne({ email: newEmail, _id: { $ne: id } });
      if (existEmail) {
        return next(new HttpError("Email already exists", 422));
      }
    }

    // Update student
    const updatedStudent = await voterModel.findByIdAndUpdate(
      id,
      {
        ...(studentId && { studentId }),
        ...(fullName && { fullName }),
        ...(email && { email: email.toLowerCase() }),
        ...(department !== undefined && { department }),
        ...(departmentCode !== undefined && { departmentCode }),
        ...(year !== undefined && { year }),
      },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      message: "Student updated successfully",
      student: updatedStudent
    });
  } catch (error) {
    return next(new HttpError("Failed to update student", 422));
  }
};

// ========== DELETE STUDENT (Admin Only)
// DELETE: api/voters/students/:id
// PROTECTED (Admin Only)
const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const student = await voterModel.findById(id);
    if (!student) {
      return next(new HttpError("Student not found", 404));
    }

    if (student.isAdmin) {
      return next(new HttpError("Cannot delete admin user", 403));
    }

    await voterModel.findByIdAndDelete(id);
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    return next(new HttpError("Failed to delete student", 500));
  }
};

module.exports = { 
  registerVoter, 
  loginVoter, 
  getVoter, 
  refreshToken,
  addStudent,
  getAllStudents,
  updateStudent,
  deleteStudent
};
