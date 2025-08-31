const { Router }  = require('express')

const { registerVoter,loginVoter,getVoter } = require("../controllers/voterController")

const { addElections, getElections, getElection, removeElections, updateElections, getElectionCandidates, getElectionVoter, updateElectionStatus, startVoting, resetElectionVotes } = require('../controllers/electionController')


const { addCandidate, getCandidate, removeCandidate, voteCandidate } = require('../controllers/candidatesController')

const authMiddleware = require("../middleware/authMiddleware")


const router = Router()

router.post('/voters/register', registerVoter)
router.post('/voters/login', loginVoter)
router.get('/voters/:id',authMiddleware, getVoter)


router.post('/elections', authMiddleware, addElections)
router.get('/elections',authMiddleware, getElections)
router.get('/elections/:id',authMiddleware, getElection)
router.delete('/elections/:id', authMiddleware, removeElections)
router.patch('/elections/:id',authMiddleware, updateElections)
router.get('/elections/:id/candidates',authMiddleware, getElectionCandidates)
router.get('/elections/:id/voters',authMiddleware, getElectionVoter)
// Admin-only election control routes
router.patch('/elections/:id/status', authMiddleware, updateElectionStatus)
router.patch('/elections/:id/start', authMiddleware, startVoting)
router.delete('/elections/:id/votes', authMiddleware, resetElectionVotes)


 router.post('/candidates',authMiddleware, addCandidate)
 router.get('/candidates/:id',authMiddleware, getCandidate)
 router.delete('/candidates/:id',authMiddleware, removeCandidate)
 router.patch('/candidates/:id', authMiddleware,voteCandidate)


module.exports = router