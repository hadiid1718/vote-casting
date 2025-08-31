const { Schema, model, Types } = require("mongoose");

const electionSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, required: true },
  candidates: [{ type: Types.ObjectId, ref: "Candidate", required: true }],
  voters: [{ type: Types.ObjectId, ref: "Voter", required: true }],
  // Voting schedule fields
  votingStartTime: { 
    type: Date, 
    required: true,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // Default to 24 hours from now
  },
  votingEndTime: { 
    type: Date, 
    required: true,
    default: function() {
      return new Date(this.votingStartTime.getTime() + 4 * 60 * 60 * 1000); // 4 hours after start
    }
  },
  status: {
    type: String,
    enum: ['scheduled', 'active', 'completed'],
    default: 'scheduled'
  },
  duration: {
    type: Number, // Duration in hours
    default: 4,
    min: 1,
    max: 24
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

module.exports = model("Election", electionSchema);
