const { Schema, model, Types } = require("mongoose");

const voterSchema = new Schema({
  studentId: { type: String, required: false, unique: true }, // Student ID as voter ID (auto-generated for admin)
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, required: false }, // Department field for departmental elections
  departmentCode: { type: String, required: false }, // Department code for easier management
  year: { type: String, required: false }, // Academic year
  votedElection: [{ type: Types.ObjectId, ref: "Election", required: true }],
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true});

module.exports = model("Voter", voterSchema);
