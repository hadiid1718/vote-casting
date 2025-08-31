const HttpError = require("../models/errorModel");
const ElectionModel = require("../models/electionModel");

// Middleware to check if voting is currently allowed for an election
const checkVotingTime = async (req, res, next) => {
  try {
    const electionId = req.params.id || req.body.selectedElection;
    
    if (!electionId) {
      return next(new HttpError("Election ID is required", 422));
    }
    
    const election = await ElectionModel.findById(electionId);
    
    if (!election) {
      return next(new HttpError("Election not found", 404));
    }
    
    // First update the election status based on current time
    const now = new Date();
    
    // Check if it's between start and end time
    if (election.status !== 'active') {
      if (election.status === 'scheduled') {
        return next(new HttpError(`Voting has not started yet. Voting starts at ${election.votingStartTime.toLocaleString()}`, 403));
      } else if (election.status === 'completed') {
        return next(new HttpError("Voting has ended for this election", 403));
      }
    }
    
    // Check if within the voting window
    if (now < election.votingStartTime) {
      return next(new HttpError(`Voting has not started yet. Voting starts at ${election.votingStartTime.toLocaleString()}`, 403));
    }
    
    if (now > election.votingEndTime) {
      // Update status if it hasn't been updated yet
      if (election.status !== 'completed') {
        election.status = 'completed';
        await election.save();
      }
      return next(new HttpError("Voting has ended for this election", 403));
    }
    
    // If we get here, voting is allowed
    req.election = election; // Attach election to request for later use
    next();
    
  } catch (error) {
    return next(new HttpError(error.message || "Error checking voting time", 500));
  }
};

// Middleware to check if a voter has already voted in this election
const checkVoterEligibility = async (req, res, next) => {
  try {
    const { id: voterId } = req.user;
    const electionId = req.params.id || req.body.selectedElection;
    
    if (!voterId || !electionId) {
      return next(new HttpError("Voter ID and Election ID are required", 422));
    }
    
    const election = await ElectionModel.findById(electionId);
    
    if (!election) {
      return next(new HttpError("Election not found", 404));
    }
    
    // Check if voter has already voted in this election
    if (election.voters.includes(voterId)) {
      return next(new HttpError("You have already voted in this election", 403));
    }
    
    next();
    
  } catch (error) {
    return next(new HttpError(error.message || "Error checking voter eligibility", 500));
  }
};

module.exports = {
  checkVotingTime,
  checkVoterEligibility
};
