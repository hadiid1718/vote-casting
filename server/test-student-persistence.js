const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");
require("dotenv").config();

const Routes = require("./routes/Routes");
const { notFound, errorHandler} = require("./middleware/errorMiddleware");

const app = express();
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "*" }));

app.use("/api", Routes);

// Add a simple test endpoint to check students without auth
app.get("/test-students", async (req, res) => {
  try {
    const voterModel = require("./models/voterModel");
    const students = await voterModel.find({ isAdmin: false }).select("-password");
    
    res.json({
      success: true,
      message: `Found ${students.length} students`,
      students: students,
      count: students.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test endpoint to get admin info
app.get("/test-admin", async (req, res) => {
  try {
    const voterModel = require("./models/voterModel");
    const admin = await voterModel.findOne({ isAdmin: true }).select("-password");
    
    if (admin) {
      res.json({
        success: true,
        admin: {
          id: admin._id,
          fullName: admin.fullName,
          email: admin.email,
          isAdmin: admin.isAdmin
        }
      });
    } else {
      res.json({
        success: false,
        message: "No admin found"
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.use(notFound);
app.use(errorHandler);

const PORT = 3002;

connect(process.env.MONGO_DB_URL).then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Test server running on http://localhost:${PORT}`);
    console.log("🧪 Test endpoints:");
    console.log("   GET http://localhost:3002/test-students (no auth required)");
    console.log("   GET http://localhost:3002/test-admin (no auth required)");
    console.log("   GET http://localhost:3002/api/test (server health check)");
    console.log("");
    console.log("📋 Your students should be visible at /test-students");
    console.log("🔑 Your admin info should be visible at /test-admin");
  });
}).catch(err => {
  console.error("❌ Database connection failed:", err);
  process.exit(1);
});
