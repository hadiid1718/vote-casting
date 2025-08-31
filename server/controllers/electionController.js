

const HttpError = require("../models/errorModel");
const { v4: uuid } = require("uuid");
const cloudinary = require("../utils/cloudinary");
const path = require("path");
const ElectionModel = require("../models/electionModel");
const CandidatesModel = require("../models/candidateModel");
const VoteModel = require("../models/voteModel");
const VoterModel = require("../models/voterModel");
const mongoose = require("mongoose");



// ========== Add Election
// POST: api/elections
//PROTECTED (Onnly Admin)
const addElections = async (req, res, next) => {
  try {
    // only admin can access
    if(!req.user.isAdmin) {
      return next(new HttpError("Only admin can change it.", 403))
    }
    const { title, description, votingStartTime, duration } = req?.body;
    if (!title || !description) {
      return next(new HttpError("Fill all the fields.", 422));
    }
    
    // Validate and set voting schedule
    let startTime = new Date();
    let endTime = new Date();
    let votingDuration = parseInt(duration) || 4; // Default 4 hours
    
    if (votingStartTime) {
      startTime = new Date(votingStartTime);
      if (startTime < new Date()) {
        return next(new HttpError("Voting start time cannot be in the past.", 422));
      }
    } else {
      // Default to tomorrow at 9 AM
      startTime = new Date();
      startTime.setDate(startTime.getDate() + 1);
      startTime.setHours(9, 0, 0, 0);
    }
    
    endTime = new Date(startTime.getTime() + votingDuration * 60 * 60 * 1000);
    if (!req?.files?.thumbnail) {
      return next(new HttpError("Please choose a thumbnail", 422));
    }
    const { thumbnail } = req.files;

    // set the size of thumbnail
    if (thumbnail.size > 1000000) {
      return next(new HttpError("The file size must be less then 1mb", 422));
    }
    
    // rename the file/thumnail.
    let fileName = thumbnail.name;
    fileName = fileName.split(".");
    fileName = fileName[0] + uuid() + "." + fileName[fileName.length - 1];
    
    const filePath = path.join(__dirname, "..", "uploads", fileName);
    
    // Convert thumbnail.mv to promise to properly handle async operations
    const moveFile = () => {
      return new Promise((resolve, reject) => {
        thumbnail.mv(filePath, (err) => {
          if (err) {
            reject(new HttpError("Failed to save file", 500));
          } else {
            resolve();
          }
        });
      });
    };
    
    // Upload directly to cloudinary using signed upload
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          use_filename: true,
          unique_filename: true,
          folder: "elections"
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(thumbnail.data);
    });
    
    if (!result.secure_url) {
      return next(new HttpError("Couldn't upload image to cloudinary", 422));
    }
    
    // Save election to database
    const newElection = await ElectionModel.create({
      title,
      description,
      thumbnail: result.secure_url,
      votingStartTime: startTime,
      votingEndTime: endTime,
      duration: votingDuration,
      status: 'scheduled'
    });
    
    res.status(201).json(newElection);
    
  } catch (error) {
    console.error('Election creation error:', error);
    return next(new HttpError(error.message || "Election creation failed", 500));
  }
};

// ========== Get All Election
// GET: api/elections/:id
//PROTECTED
const getElections = async (req, res, next) => {
  try {
    
    const elections = await ElectionModel.find();
    res.status(200).json(elections);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ========== GET single Election
// GET: api/elections/:id
//PROTECTED
const getElection = async (req, res, next) => {
  try {
    const { id } = req?.params;
    const election = await ElectionModel.findById(id);
    res.status(200).json(election);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ========== remove Election
// delete: api/elections/:id
//PROTECTED
const removeElections = async (req, res, next) => {
      try {
            // only admin can access
    if(!req.user.isAdmin) {
      return next(new HttpError("Only admin can change it.", 403))
    }
    const { id } = req?.params;
    await ElectionModel.findByIdAndDelete(id);

    // candidates removal that belong to specific election


    await CandidatesModel.deleteMany({ election : id})
    res.status(200).json({ message : 'Electiono deleted successfully'})
      } catch (error) {
        return next(new HttpError(error))
      }
};

// ========== Update Election
// PATCH: api/elections/:id
//PROTECTED
const updateElections = async (req, res, next) => {
  try {
    const { id } = req?.params;
    // only admin can access
    if(!req.user.isAdmin) {
      return next(new HttpError("Only admin can change it.", 403))
    }
    const { title, description } = req?.body;
    if (!title || !description) {
      return next(new HttpError("Fill all the fields.", 422));
    }
    
    // Check if there's a new thumbnail file
    if (req.files && req.files.thumbnail) {
      const { thumbnail } = req.files;
      if (thumbnail.size > 1000000) {
        return next(
          new HttpError("Size is too big! must be less than 1mb.", 422)
        );
      }
      
      // rename the file/thumnail.
      let fileName = thumbnail.name;
      fileName = fileName.split(".");
      fileName = fileName[0] + uuid() + "." + fileName[fileName.length - 1];
      
      const filePath = path.join(__dirname, "..", "uploads", fileName);
      
      // Convert thumbnail.mv to promise
      const moveFile = () => {
        return new Promise((resolve, reject) => {
          thumbnail.mv(filePath, (err) => {
            if (err) {
              reject(new HttpError("Failed to save file", 500));
            } else {
              resolve();
            }
          });
        });
      };
      
      // Upload directly to cloudinary using buffer to avoid timestamp issues
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            use_filename: true,
            unique_filename: true,
            folder: "elections"
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        ).end(thumbnail.data);
      });
      
      if (!result.secure_url) {
        return next(new HttpError("couldn't upload on cloudinary try again!", 422));
      }
      
      // Update with new thumbnail
      const updatedElection = await ElectionModel.findByIdAndUpdate(
        id, 
        { title, description, thumbnail: result.secure_url }, 
        { new: true }
      );
      res.status(200).json(updatedElection);
      
    } else {
      // Update without changing thumbnail
      const updatedElection = await ElectionModel.findByIdAndUpdate(
        id, 
        { title, description }, 
        { new: true }
      );
      res.status(200).json(updatedElection);
    }
    
  } catch (error) {
    console.error('Election update error:', error);
    return next(new HttpError(error.message || "Election update failed", 500));
  }
};

// ========== Get Candidates
// Get: api/elections/:id/candidates
//PROTECTED (Onnly Admin)
const getElectionCandidates = async (req, res, next) => {
  try {
    const { id } = req?.params;
    const candidate = await CandidatesModel.find({ election: id });
    res.status(200).json(candidate);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ========== GET VOTERS
// GET: api/elections/:id/voters
//PROTECTED
const getElectionVoter = async (req, res, next) => {
  try {
    const { id } = req?.params;
    const response = await ElectionModel.findById(id).populate("voters");
    
    // Get all votes for this election to track voting status and times
    const votes = await VoteModel.find({ election: id }).populate('voter');
    
    // Create a map of voter ID to vote data for quick lookup
    const voteMap = new Map();
    votes.forEach(vote => {
      if (vote.voter) {
        voteMap.set(vote.voter._id.toString(), {
          hasVoted: true,
          voteTime: vote.voteTime
        });
      }
    });
    
    // Enhance voter data with voting status for this specific election
    const enrichedVoters = response.voters.map(voter => {
      const voteData = voteMap.get(voter._id.toString());
      
      return {
        _id: voter._id,
        fullName: voter.fullName,
        email: voter.email,
        createdAt: voter.createdAt,
        hasVoted: voteData ? voteData.hasVoted : false,
        voteTime: voteData ? voteData.voteTime : null
      };
    });
    
    res.status(200).json(enrichedVoters);
  } catch (error) {
    console.error('Error fetching election voters:', error);
    return next(new HttpError(error.message || "Failed to fetch voters", 500));
  }
};

// ========== RESET VOTES (Admin Only - for testing)
// DELETE: api/elections/:id/votes
// PROTECTED (Only Admin)
const resetElectionVotes = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(new HttpError("Only admin can reset votes.", 403));
    }
    
    const { id } = req.params;
    
    const session = await mongoose.startSession();
    
    try {
      await session.startTransaction();
      
      // Delete all votes for this election
      await VoteModel.deleteMany({ election: id }, { session });
      
      // Reset all candidate vote counts for this election
      await CandidatesModel.updateMany(
        { election: id },
        { voteCount: 0 },
        { session }
      );
      
      // Remove this election from all voters' votedElection arrays
      await VoterModel.updateMany(
        { votedElection: id },
        { $pull: { votedElection: id } },
        { session }
      );
      
      // Remove all voters from this election's voters array
      await ElectionModel.findByIdAndUpdate(
        id,
        { voters: [] },
        { session }
      );
      
      await session.commitTransaction();
      res.status(200).json({ message: "All votes for this election have been reset" });
      
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
    
  } catch (error) {
    console.error('Error resetting votes:', error);
    return next(new HttpError(error.message || "Failed to reset votes", 500));
  }
};

// ========== Update Election Status (Admin Only)
// PATCH: api/elections/:id/status
// PROTECTED (Only Admin)
const updateElectionStatus = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(new HttpError("Only admin can change election status.", 403));
    }
    
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['scheduled', 'active', 'completed'].includes(status)) {
      return next(new HttpError("Invalid status. Must be scheduled, active, or completed.", 422));
    }
    
    const election = await ElectionModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!election) {
      return next(new HttpError("Election not found.", 404));
    }
    
    res.status(200).json(election);
  } catch (error) {
    return next(new HttpError(error.message || "Failed to update election status", 500));
  }
};

// ========== Start Voting (Admin Only)
// PATCH: api/elections/:id/start
// PROTECTED (Only Admin)
const startVoting = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(new HttpError("Only admin can start voting.", 403));
    }
    
    const { id } = req.params;
    const now = new Date();
    
    const election = await ElectionModel.findById(id);
    if (!election) {
      return next(new HttpError("Election not found.", 404));
    }
    
    // Update voting start time to now and recalculate end time
    const endTime = new Date(now.getTime() + election.duration * 60 * 60 * 1000);
    
    const updatedElection = await ElectionModel.findByIdAndUpdate(
      id,
      { 
        votingStartTime: now,
        votingEndTime: endTime,
        status: 'active'
      },
      { new: true }
    );
    
    res.status(200).json(updatedElection);
  } catch (error) {
    return next(new HttpError(error.message || "Failed to start voting", 500));
  }
};

// ========== Check and Update Election Status Based on Time
// Utility function to be called periodically
const updateElectionStatusByTime = async () => {
  try {
    const now = new Date();
    
    // Update elections to active if voting has started
    await ElectionModel.updateMany(
      {
        votingStartTime: { $lte: now },
        votingEndTime: { $gt: now },
        status: 'scheduled'
      },
      { status: 'active' }
    );
    
    // Update elections to completed if voting has ended
    await ElectionModel.updateMany(
      {
        votingEndTime: { $lte: now },
        status: { $in: ['scheduled', 'active'] }
      },
      { status: 'completed' }
    );
    
  } catch (error) {
    console.error('Failed to update election statuses:', error);
  }
};

module.exports = {
  addElections,
  getElections,
  getElection,
  getElectionCandidates,
  updateElections,
  removeElections,
  getElectionVoter,
  updateElectionStatus,
  startVoting,
  updateElectionStatusByTime,
  resetElectionVotes
};
