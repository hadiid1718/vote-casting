
const HttpError = require("../models/errorModel");
const { v4: uuid } = require("uuid");
const { uploadToCloudinary } = require("../utils/cloudinary");
const path = require("path");
const ElectionModel = require("../models/electionModel");
const CandidatesModel = require("../models/candidateModel");
const VoterModel = require("../models/voterModel")
const VoteModel = require("../models/voteModel");
const mongoose = require("mongoose");
const { checkVotingTime, checkVoterEligibility } = require("../middleware/voteTimeMiddleware");




// ========== Add Candidates
// POST: api/candidates
//PROTECTED (Only Admin)
const addCandidate = async(req,res, next) => {
  try {
    console.log('addCandidate called with:', {
      fullName: req?.body?.fullName,
      motto: req?.body?.motto,
      currentElection: req?.body?.currentElection,
      files: req?.files ? Object.keys(req.files) : 'no files',
      user: req?.user ? { id: req.user.id, isAdmin: req.user.isAdmin } : 'no user'
    });
    
    // only admin can access
    if(!req.user.isAdmin) {
      return next(new HttpError("Only admin can change it.", 403))
    }
    const { fullName, motto, currentElection } = req?.body;
    if (!fullName || !motto) {
      return next(new HttpError("Fill all the fields.", 422));
    }
    
    console.log('Checking for image file...');
    console.log('Request files:', req?.files);
    if (!req?.files?.image) {
      console.log('No image file found in request');
      return next(new HttpError("Please choose a candidate image. Make sure to select an image file before adding the candidate.", 422));
    }
    const { image } = req.files;
    console.log('Candidate image file details:', {
      name: image.name,
      size: image.size,
      mimetype: image.mimetype
    });

    // set the size of thumbnail
    if (image.size > 1000000) {
      return next(new HttpError("Image size should be less than 1mb", 422));
    }
    // rename the file/image.
    let fileName = image.name;
    fileName = fileName.split(".");
    fileName = fileName[0] + uuid() + "." + fileName[fileName.length - 1];
    
    const filePath = path.join(__dirname, "..", "uploads", fileName);
    
    // Convert image.mv to promise to properly handle async operations
    const moveFile = () => {
      return new Promise((resolve, reject) => {
        image.mv(filePath, (err) => {
          if (err) {
            reject(new HttpError("Failed to save image file", 500));
          } else {
            resolve();
          }
        });
      });
    };
    
    // Upload to cloudinary using our helper function
    console.log('Starting upload to cloudinary for candidate image...');
    const result = await uploadToCloudinary(image, "candidates");
    console.log('Upload completed, result:', {
      secure_url: result.secure_url,
      public_id: result.public_id
    });
    
    if (!result.secure_url) {
      console.log('Upload failed - no secure_url in result');
      return next(new HttpError("Couldn't upload image to cloudinary", 422));
    }
    
    // Create candidate
    let newCandidate = await CandidatesModel.create({
      fullName,
      motto,
      image: result.secure_url,
      election: currentElection
    });
    
    // Update election with new candidate
    let election = await ElectionModel.findById(currentElection);
    const session = await mongoose.startSession();
    
    try {
      session.startTransaction();
      await newCandidate.save({ session });
      election.candidates.push(newCandidate);
      await election.save({ session });
      await session.commitTransaction();
    } catch (sessionError) {
      await session.abortTransaction();
      throw sessionError;
    } finally {
      session.endSession();
    }
    
    res.status(201).json(newCandidate);
  } catch (error) {
    console.error('Candidate creation error:', error);
    return next(new HttpError(error.message || "Candidate creation failed", 500));
  }
 }


// ========== Get CAndidate
// GET: api/candidates/:id
//PROTECTED 
const getCandidate = async(req,res, next) => {
  try {
    const { id } = req?.params
    const candidate = await CandidatesModel.findById(id)
    res.json(candidate)
  } catch (error) {
    return next(new HttpError(error))
  }
 }


// ========== Add Election
// Remove: api/candidates/:id
//PROTECTED (Only Admin)
const removeCandidate = async (req, res, next) => {
  try {
      if (!req.user.isAdmin) {
          return next(new HttpError("Only admin can perform this action.", 403));
      }

      const { id } = req.params;

      let currentCandidate = await CandidatesModel.findById(id);
      if (!currentCandidate) {
          return next(new HttpError("Candidate not found", 422));
      }

      const session = await mongoose.startSession();
      
      try {
          await session.startTransaction();
          
          // Get the election this candidate belongs to
          const electionId = currentCandidate.election;
          
          // Delete the candidate
          await CandidatesModel.findByIdAndDelete(id, { session });

          // Remove candidate's ID from the election's candidates array
          await ElectionModel.findByIdAndUpdate(
            electionId,
            { $pull: { candidates: id } },
            { session }
          );

          // Commit transaction
          await session.commitTransaction();

          res.status(200).json({ message: "Candidate deleted successfully" });
      } catch (error) {
          await session.abortTransaction();
          throw error;
      } finally {
          session.endSession();
      }
  } catch (error) {
      return next(new HttpError(error.message || "Failed to delete candidate", 500));
  }
};


// ==========  voters
// patch: api/candidates/:id
//PROTECTED
const voteCandidate = async(req,res, next) => {
  try {
    const { id: candidateId} = req?.params;
    const { currentVoterId, selectedElection} = req?.body;
    
    if (!currentVoterId || !selectedElection) {
      return next(new HttpError("Missing voting data", 422));
    }
    
    // Check if the current user is an admin (admins cannot vote)
    if (req.user.isAdmin) {
      return next(new HttpError("Administrators cannot vote in elections", 403));
    }
    
    // Check if voting is currently allowed for this election
    const election = await ElectionModel.findById(selectedElection);
    if (!election) {
      return next(new HttpError("Election not found", 404));
    }
    
    const now = new Date();
    
    // Update election status based on time
    if (now < election.votingStartTime && election.status === 'scheduled') {
      return next(new HttpError(`Voting has not started yet. Voting starts at ${election.votingStartTime.toLocaleString()}`, 403));
    }
    
    if (now > election.votingEndTime || election.status === 'completed') {
      // Auto-update status if needed
      if (election.status !== 'completed') {
        election.status = 'completed';
        await election.save();
      }
      return next(new HttpError("Voting has ended for this election", 403));
    }
    
    // Check if voter has already voted using the Vote model
    const existingVote = await VoteModel.findOne({ 
      voter: currentVoterId, 
      election: selectedElection 
    });
    
    if (existingVote) {
      return next(new HttpError("You have already voted in this election", 403));
    }
    
    // Get candidate
    const candidate = await CandidatesModel.findById(candidateId);
    if (!candidate) {
      return next(new HttpError("Candidate not found", 404));
    }
    
    const newVoteCount = candidate.voteCount + 1;
    
    // Start session for relationship between voter and election
    const sess = await mongoose.startSession();
    
    try {
      sess.startTransaction();
      
      // Create vote record with timestamp
      const newVote = new VoteModel({
        voter: currentVoterId,
        election: selectedElection,
        candidate: candidateId,
        voteTime: new Date()
      });
      await newVote.save({ session: sess });
      console.log('Vote record created:', { voter: currentVoterId, election: selectedElection, candidate: candidateId });
      
      // Update candidate vote count
      const updatedCandidate = await CandidatesModel.findByIdAndUpdate(
        candidateId, 
        { voteCount: newVoteCount }, 
        { new: true, session: sess }
      );
      
      // Get the current voter
      let voter = await VoterModel.findById(currentVoterId).session(sess);
      if (!voter) {
        throw new Error("Voter not found");
      }
      
      // Get election
      let electionDoc = await ElectionModel.findById(selectedElection).session(sess);
      if (!electionDoc) {
        throw new Error("Election not found");
      }
      
      // Add voter to election's voters list only if not already there
      if (!electionDoc.voters.includes(voter._id)) {
        electionDoc.voters.push(voter._id);
        await electionDoc.save({ session: sess });
      }
      
      // Add election to voter's voted elections only if not already there
      if (!voter.votedElection.includes(electionDoc._id)) {
        voter.votedElection.push(electionDoc._id);
        await voter.save({ session: sess });
      }
      
      await sess.commitTransaction();
      res.status(200).json(updatedCandidate);
      
    } catch (sessionError) {
      await sess.abortTransaction();
      throw sessionError;
    } finally {
      sess.endSession();
    }
    
  } catch (error) {
    console.error('Voting error:', error);
    return next(new HttpError(error.message || "Voting failed", 500));
  }
};


  
 

 module.exports = { addCandidate, getCandidate,removeCandidate,voteCandidate}