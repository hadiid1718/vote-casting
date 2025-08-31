const mongoose = require('mongoose');
const ElectionModel = require('../models/electionModel');
const VoterModel = require('../models/voterModel');
const CandidatesModel = require('../models/candidateModel');
const VoteModel = require('../models/voteModel');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/voting_system');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Migration function to create Vote records for existing data
const migrateExistingVotes = async () => {
  try {
    console.log('Starting vote migration...');
    
    // Find all elections that have voters
    const elections = await ElectionModel.find({ voters: { $exists: true, $ne: [] } }).populate('voters');
    
    let migratedVotes = 0;
    
    for (const election of elections) {
      console.log(`Processing election: ${election.title}`);
      
      for (const voter of election.voters) {
        // Check if this voter has voted in this election (from their votedElection array)
        if (voter.votedElection.includes(election._id)) {
          
          // Check if a Vote record already exists
          const existingVote = await VoteModel.findOne({
            voter: voter._id,
            election: election._id
          });
          
          if (!existingVote) {
            // We need to determine which candidate they voted for
            // Since we don't have this data in the current model, we'll need to make an assumption
            // or skip this migration. For now, let's skip voters who already have Vote records
            console.log(`Skipping voter ${voter.fullName} - cannot determine candidate choice from existing data`);
          } else {
            console.log(`Vote record already exists for voter ${voter.fullName} in election ${election.title}`);
          }
        }
      }
    }
    
    console.log(`Migration completed. Total votes migrated: ${migratedVotes}`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

// Run migration
connectDB().then(migrateExistingVotes);
