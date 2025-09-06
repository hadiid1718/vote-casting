const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { connect } = require("mongoose");
require("dotenv").config("");
const upload = require("express-fileupload")

const Routes = require("./routes/Routes");
const { notFound, errorHandler} = require("./middleware/errorMiddleware")
const { updateElectionStatusByTime } = require('./controllers/electionController');


// Ensure necessary directories exist
const ensureDirectoriesExist = () => {
  const directories = [
    path.join(__dirname, 'uploads'),
    path.join(__dirname, 'uploads', 'elections'),
    path.join(__dirname, 'temp')
  ];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

// Create necessary directories
ensureDirectoriesExist();

// Log environment variables (safely)
console.log('Environment check:', {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  MONGO_DB_URL: process.env.MONGO_DB_URL ? 'set' : 'not set',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'set' : 'not set',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'set' : 'not set',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'set' : 'not set'
});

const app = express();
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
// CORS configuration for production and development
const allowedOrigins = [
  "http://localhost:5173", // Development
  "http://localhost:3000", // Development alternative
  process.env.FRONTEND_URL, // Production URL from environment variable
].filter(Boolean); // Remove undefined values

app.use(cors({ 
  credentials: true, 
  origin: allowedOrigins
}));

app.use(upload())

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api", Routes);
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 3000;

connect(process.env.MONGO_DB_URL).then(
     app.listen(PORT, () => {
    console.log(`server started on port: http://localhost:${PORT}`);
    
    // Start automatic election status updater (runs every minute)
    setInterval(updateElectionStatusByTime, 60000); // 60000ms = 1 minute
    console.log('Election status updater started');
    
  }) 
).catch(err => console.log(err))
