const { connect } = require("mongoose");
const voterModel = require("./models/voterModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function runDiagnostics() {
  try {
    console.log("🔍 STUDENT PERSISTENCE DIAGNOSTIC TOOL");
    console.log("=====================================\n");

    // Step 1: Test Database Connection
    console.log("1. Testing Database Connection...");
    await connect(process.env.MONGO_DB_URL);
    console.log("✅ Database connected successfully\n");

    // Step 2: Check current students in database
    console.log("2. Checking current students in database...");
    const students = await voterModel.find({ isAdmin: false }).select("-password");
    console.log(`📊 Found ${students.length} students in database:`);
    
    if (students.length > 0) {
      students.forEach((student, index) => {
        console.log(`   ${index + 1}. ${student.fullName} (ID: ${student.studentId})`);
      });
    } else {
      console.log("   No students found");
    }
    console.log("");

    // Step 3: Test admin authentication
    console.log("3. Testing admin authentication...");
    const admin = await voterModel.findOne({ isAdmin: true });
    if (admin) {
      console.log(`✅ Admin found: ${admin.fullName} (${admin.email})`);
      
      // Generate test token
      const token = jwt.sign({ id: admin._id, isAdmin: true }, process.env.JWT_SEC, { expiresIn: "1h" });
      console.log("✅ Test token generated successfully");
      console.log(`   Token (first 50 chars): ${token.substring(0, 50)}...`);
    } else {
      console.log("❌ No admin found in database");
    }
    console.log("");

    // Step 4: Test getAllStudents function directly
    console.log("4. Testing getAllStudents function directly...");
    try {
      const { getAllStudents } = require("./controllers/voterController");
      
      // Mock request and response objects
      const mockReq = {
        user: admin // Simulate authenticated admin user
      };
      
      const mockRes = {
        json: (data) => {
          console.log("✅ getAllStudents function response:");
          if (Array.isArray(data) && data.length > 0) {
            console.log(`   Returned ${data.length} students`);
            data.forEach((student, index) => {
              console.log(`   ${index + 1}. ${student.fullName} (ID: ${student.studentId})`);
            });
          } else {
            console.log("   No students returned or empty array");
          }
          return data;
        }
      };
      
      const mockNext = (error) => {
        if (error) {
          console.log("❌ getAllStudents function error:", error.message);
        }
      };
      
      await getAllStudents(mockReq, mockRes, mockNext);
    } catch (error) {
      console.log("❌ Error testing getAllStudents function:", error.message);
    }
    console.log("");

    // Step 5: Check if the issue is in middleware
    console.log("5. Testing middleware functions...");
    try {
      const authMiddleware = require("./middleware/authMiddleware");
      const adminMiddleware = require("./middleware/adminMiddleware");
      console.log("✅ Middleware files loaded successfully");
    } catch (error) {
      console.log("❌ Error loading middleware:", error.message);
    }
    console.log("");

    // Step 6: Recommendations
    console.log("📋 DIAGNOSTIC SUMMARY & RECOMMENDATIONS:");
    console.log("=========================================");
    
    if (students.length > 0) {
      console.log("✅ GOOD NEWS: Your students ARE persisting in the database!");
      console.log("✅ Database connection is working properly");
      console.log("✅ Student data is being saved correctly");
      console.log("");
      console.log("🔍 THE ISSUE IS LIKELY IN YOUR FRONTEND OR API CALLS:");
      console.log("   1. Check your frontend API call to /api/voters/students");
      console.log("   2. Ensure you're sending the correct Authorization header");
      console.log("   3. Check if admin token is being stored/retrieved properly");
      console.log("   4. Verify the frontend is calling the correct API endpoint");
      console.log("   5. Check browser console for any JavaScript errors");
      console.log("");
      console.log("🛠️ DEBUGGING STEPS:");
      console.log("   1. Open browser developer tools (F12)");
      console.log("   2. Go to Network tab");
      console.log("   3. Try to view students list in your frontend");
      console.log("   4. Check if the API call is made and what response it gets");
      console.log("   5. Check Console tab for any JavaScript errors");
    } else {
      console.log("⚠️ No students found in database");
      console.log("   - This could mean students were never added successfully");
      console.log("   - Or they were added to a different database");
      console.log("   - Check if addStudent function is working correctly");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Diagnostic failed:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
}

console.log("Starting diagnostic...\n");
runDiagnostics();
