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



const app = express();



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

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
// CORS configuration for production and development
const isProd = (process.env.NODE_ENV || 'development') === 'production';

const allowedOrigins = [
  process.env.FRONTEND_URL, // Production URL from environment variable
].filter(Boolean);

app.use(cors({
  credentials: true,
  origin: (origin, callback) => {
    // Allow non-browser clients (curl/postman) with no Origin
    if (!origin) return callback(null, true);

    // In dev, allow any localhost/127.0.0.1 port (Vite often shifts ports)
    if (!isProd) {
      const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      if (isLocalhost) return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) return callback(null, true);

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
}));

app.use(upload())

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve public files (for debugging tools)
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api", Routes);

// API-only 404 + error handling
app.use('/api', notFound);
app.use('/api', errorHandler);

// If a React build exists, serve it (production usage)
const buildDir = path.join(__dirname, 'build');
const buildIndex = path.join(buildDir, 'index.html');
if (fs.existsSync(buildIndex)) {
  app.use(express.static(buildDir));
  app.get('*', (req, res) => {
    res.sendFile(buildIndex);
  });
}

const PORT = process.env.PORT || 3000;

connect(process.env.MONGO_DB_URL).then(
     app.listen(PORT, () => {
    console.log(`server started on port: http://localhost:${PORT}`);
    
    // Start automatic election status updater (runs every minute)
    setInterval(updateElectionStatusByTime, 60000); // 60000ms = 1 minute
    console.log('Election status updater started');
    
  }) 
).catch(err => console.log(err))
