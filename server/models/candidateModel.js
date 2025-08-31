const { Schema, model, Types } = require("mongoose");

const candidateSchema = new Schema({
  fullName: { type: String, required: true },
  image: { type: String, required: true },
  motto: { type: String, required: true },
  voteCount: { type: Number, default: 0 },
  election: [{ type: Types.ObjectId, ref: "Election", required: true }],
});

module.exports = model("Candidate", candidateSchema);
