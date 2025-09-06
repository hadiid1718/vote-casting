const { Router }  = require('express')

const { registerVoter,loginVoter,getVoter,refreshToken, addStudent, getAllStudents, updateStudent, deleteStudent } = require("../controllers/voterController")

const { addElections, getElections, getElection, removeElections, updateElections, getElectionCandidates, getElectionVoter, updateElectionStatus, startVoting, resetElectionVotes } = require('../controllers/electionController')


const { addCandidate, getCandidate, removeCandidate, voteCandidate } = require('../controllers/candidatesController')

const { createBlog, uploadBlogImages, getBlogs, getBlog, updateBlog, deleteBlog, toggleBlogLike, getBlogComments, createComment, updateComment, deleteComment, toggleCommentLike, toggleCommentPin } = require('../controllers/blogController')

const authMiddleware = require("../middleware/authMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware")


const router = Router()

router.post('/voters/register', registerVoter)
router.post('/voters/login', loginVoter)
router.post('/voters/refresh-token', refreshToken)
router.get('/voters/:id',authMiddleware, getVoter)

// Admin student management routes
router.post('/voters/add-student', authMiddleware, adminMiddleware, addStudent)
router.get('/voters/students', authMiddleware, adminMiddleware, getAllStudents)
router.patch('/voters/students/:id', authMiddleware, adminMiddleware, updateStudent)
router.delete('/voters/students/:id', authMiddleware, adminMiddleware, deleteStudent)


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

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Server is working', timestamp: new Date() });
});

// Test cloudinary route
router.get('/test-cloudinary', async (req, res) => {
  try {
    const { testCloudinaryConnection } = require('../utils/cloudinary');
    const result = await testCloudinaryConnection();
    res.json({
      message: 'Cloudinary test completed',
      cloudinary: result,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      message: 'Cloudinary test failed',
      error: error.message,
      timestamp: new Date()
    });
  }
});

// Test upload route
router.post('/test-upload', authMiddleware, async (req, res) => {
  try {
    const { uploadToCloudinary } = require('../utils/cloudinary');
    
    if (!req.files || !req.files.testImage) {
      return res.status(400).json({ error: 'No test image provided' });
    }
    
    const result = await uploadToCloudinary(req.files.testImage, 'test');
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Blog routes
router.post('/blogs', authMiddleware, createBlog)
router.post('/blogs/upload-images', authMiddleware, uploadBlogImages)
router.get('/blogs', getBlogs)
router.get('/blogs/:id', getBlog)
router.patch('/blogs/:id', authMiddleware, updateBlog)
router.delete('/blogs/:id', authMiddleware, deleteBlog)
router.patch('/blogs/:id/like', authMiddleware, toggleBlogLike)

// Comment routes
router.get('/blogs/:id/comments', getBlogComments)
router.post('/blogs/:id/comments', authMiddleware, createComment)
router.patch('/comments/:commentId', authMiddleware, updateComment)
router.delete('/comments/:commentId', authMiddleware, deleteComment)
router.patch('/comments/:commentId/like', authMiddleware, toggleCommentLike)
router.patch('/comments/:commentId/pin', authMiddleware, toggleCommentPin)

module.exports = router
