# 🗳️ IIT Voting System

A comprehensive web-based voting platform for conducting secure, time-controlled elections with real-time results and administrative controls.

## 📋 Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

## ✨ Features

### 🔐 Authentication & Authorization
- **User Registration/Login** with JWT authentication
- **Role-based access control** (Admin vs Voter)
- **Secure session management** with localStorage persistence
- **Protected routes** for authenticated users only

### ⏰ Advanced Election Scheduling
- **Flexible timing controls** - Set exact start times and durations (1-24 hours)
- **Default 4-hour voting window** with customizable duration
- **Automatic status updates** - Elections automatically activate and close based on schedule
- **Admin override controls** - Start voting immediately or manually change status
- **Real-time countdown timers** showing time until start/end

### 🗳️ Voting System
- **Secure one-vote-per-election** enforcement
- **Time-restricted voting** - Only allowed during active voting windows
- **Real-time vote counting** with instant result updates
- **Vote confirmation modals** with candidate details
- **Automatic result calculation** with percentage breakdowns

### 📊 Results & Analytics
- **Live progress bars** showing vote distribution
- **Real-time percentage calculations** with smooth animations
- **Total vote counters** for transparency
- **Automatic result announcement** when voting ends
- **Visual result displays** with candidate photos and vote counts

### 👥 Election Management
- **Create elections** with title, description, and thumbnail images
- **Add/remove candidates** with photos, names, and mottos
- **Image upload to Cloudinary** for candidate photos and election thumbnails
- **Edit election details** (admin only)
- **Delete elections and candidates** (admin only)

### 🎨 User Interface
- **Responsive design** for desktop and mobile devices
- **Real-time status indicators** with color-coded badges
- **Toast notifications** for user feedback on all actions
- **Professional styling** with consistent design language
- **Accessibility features** with proper contrast and tooltips

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Cloudinary** for image storage
- **Express-fileupload** for file handling
- **CORS** for cross-origin requests

### Frontend
- **React 18** with modern hooks
- **Redux Toolkit** for state management
- **React Router Dom** for navigation
- **Axios** for API calls
- **React-Toastify** for notifications
- **React Icons** for UI icons
- **Vite** for fast development and building

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- Cloudinary account for image storage

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd voting/server
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create a `.env` file in the server directory:
```env
MONGO_DB_URL=your_mongodb_connection_string
JWT_SEC=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. **Start the server**
```bash
npm run dev
```
Server runs on `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../voting_app
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

## 📱 Usage

### For Voters

1. **Registration/Login**
   - Register with email and password
   - Login to access the voting dashboard

2. **Viewing Elections**
   - Browse available elections on the Elections page
   - View election details, candidates, and voting schedules
   - Check real-time status (Scheduled/Active/Completed)

3. **Casting Votes**
   - Navigate to election candidates during active voting periods
   - Click "Vote" on preferred candidate
   - Confirm vote in the modal popup
   - Receive confirmation and redirect to congratulations page

4. **Viewing Results**
   - Check Results page for live vote counts and percentages
   - View progress bars showing vote distribution
   - See total votes cast for each election

### For Administrators

1. **Election Management**
   - Create new elections with scheduling controls
   - Set voting start times and durations (default: tomorrow 9 AM, 4 hours)
   - Upload election thumbnails via Cloudinary
   - Edit election details and schedules

2. **Candidate Management**
   - Add candidates with photos, names, and mottos
   - Remove candidates from elections
   - Upload candidate photos via Cloudinary

3. **Voting Control**
   - Start voting immediately with "Start Voting Now" button
   - Manually change election status (Scheduled/Active/Completed)
   - Monitor real-time voting progress
   - Override automatic scheduling when needed

4. **Schedule Management**
   - Set custom voting start times
   - Configure voting duration (1-24 hours)
   - Monitor countdown timers and status changes
   - Automatic result announcement after voting ends

## 🔗 API Documentation

### Authentication Endpoints
```
POST /api/voters/register    # Register new voter
POST /api/voters/login       # Login voter
GET  /api/voters/:id         # Get voter details
```

### Election Endpoints
```
POST   /api/elections              # Create election (Admin)
GET    /api/elections              # Get all elections
GET    /api/elections/:id          # Get election details
PATCH  /api/elections/:id          # Update election (Admin)
DELETE /api/elections/:id          # Delete election (Admin)
PATCH  /api/elections/:id/status   # Update election status (Admin)
PATCH  /api/elections/:id/start    # Start voting immediately (Admin)
```

### Candidate Endpoints
```
POST   /api/candidates           # Add candidate (Admin)
GET    /api/candidates/:id       # Get candidate details
DELETE /api/candidates/:id       # Remove candidate (Admin)
PATCH  /api/candidates/:id       # Vote for candidate
```

### Election Data Endpoints
```
GET /api/elections/:id/candidates  # Get election candidates
GET /api/elections/:id/voters      # Get election voters
```

## 📁 Project Structure

```
voting/
├── server/                    # Backend application
│   ├── controllers/           # Request handlers
│   │   ├── candidatesController.js
│   │   ├── electionController.js
│   │   └── voterController.js
│   ├── middleware/            # Custom middleware
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── voteTimeMiddleware.js
│   ├── models/               # Database schemas
│   │   ├── candidateModel.js
│   │   ├── electionModel.js
│   │   ├── errorModel.js
│   │   └── voterModel.js
│   ├── routes/               # API routes
│   │   └── Routes.js
│   ├── utils/                # Utilities
│   │   └── cloudinary.js
│   ├── .env                  # Environment variables
│   ├── index.js              # Server entry point
│   └── package.json
│
├── voting_app/               # Frontend application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── AddCandidateModal.jsx
│   │   │   ├── AddElectionModal.jsx
│   │   │   ├── AdminRoute.jsx
│   │   │   ├── Candidate.jsx
│   │   │   ├── CandidateRating.jsx
│   │   │   ├── ConfirmVote.jsx
│   │   │   ├── Election.jsx
│   │   │   ├── ElectionCandidate.jsx
│   │   │   ├── ElectionStatus.jsx    # NEW: Status display
│   │   │   ├── LogoutButton.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ResultElection.jsx
│   │   │   └── UpdateElectionModal.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── Candidates.jsx
│   │   │   ├── Congrates.jsx
│   │   │   ├── ElectionDetail.jsx
│   │   │   ├── Elections.jsx
│   │   │   ├── ErrorPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Logout.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Result.jsx
│   │   ├── services/         # API services
│   │   │   ├── api.js
│   │   │   ├── candidateService.js
│   │   │   ├── electionService.js
│   │   │   ├── index.js
│   │   │   └── voterService.js
│   │   ├── store/            # Redux store
│   │   │   ├── store.js
│   │   │   ├── thunks.js
│   │   │   ├── ui-slice.js
│   │   │   └── vote-slice.js
│   │   ├── utils/            # Utility functions
│   │   │   ├── auth.js
│   │   │   └── authRedirect.js
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # Entry point
│   │   ├── index.css         # Global styles
│   │   └── App.css
│   ├── package.json
│   └── vite.config.js
└── README.md                 # This file
```

## 🖼️ Key Features in Action

### Election Scheduling
```
Admin creates election:
┌─────────────────────────────────────┐
│ Create New Election                 │
├─────────────────────────────────────┤
│ Title: [IIT Presidential Election]  │
│ Description: [Election details...]  │
│ Start Time: [2024-09-01 09:00] 📅   │
│ Duration: [4] hours ⏱️              │
│ Thumbnail: [Choose File] 📁         │
│                                     │
│ [Create Election]                   │
└─────────────────────────────────────┘
```

### Voting Interface
```
During Active Voting:
┌─────────────────────────────────────┐
│ 🟢 Voting Active | 2h 15m left     │
│ Cast your vote for IIT President    │
├─────────────────────────────────────┤
│ [Candidate A] [Vote Now] ✅         │
│ [Candidate B] [Vote Now] ✅         │
│ [Candidate C] [Vote Now] ✅         │
└─────────────────────────────────────┘

Outside Voting Hours:
┌─────────────────────────────────────┐
│ 🟠 Scheduled | Starts in 5h 30m    │
│ Voting not yet available            │
├─────────────────────────────────────┤
│ [Candidate A] [Voting Not Started]  │
│ [Candidate B] [Voting Not Started]  │
│ [Candidate C] [Voting Not Started]  │
└─────────────────────────────────────┘
```

### Live Results
```
Real-time Results:
┌─────────────────────────────────────┐
│ Hadeed Ul Hassan   ████████████░░░░  65% │
│ 156 votes                           │
│                                     │
│ Ahsan Abdullah   ████░░░░░░░░░░░░  35% │
│ 84 votes                            │
├─────────────────────────────────────┤
│ Total Votes Cast: 240               │
│ [Enter Elections]                   │
└─────────────────────────────────────┘
```

## 🔧 Configuration

### Election Scheduling Options
- **Default Schedule**: Tomorrow at 9:00 AM, 4-hour duration
- **Custom Start Time**: Any future date/time
- **Duration**: 1-24 hours (default: 4 hours)
- **Automatic Management**: Status updates every minute
- **Manual Override**: Admin can start/stop voting anytime

### Image Upload Settings
- **Maximum file size**: 1MB
- **Supported formats**: PNG, JPG, JPEG, WEBP, AVIF
- **Storage**: Cloudinary with organized folders
- **Automatic optimization**: Images optimized for web display

## 🔒 Security Features

### Authentication Security
- **JWT tokens** with secure secret keys
- **Password hashing** for user credentials
- **Session persistence** with secure localStorage
- **Protected API endpoints** requiring authentication

### Voting Security
- **One vote per election** enforcement
- **Time-based voting restrictions** with server-side validation
- **Double-vote prevention** through database constraints
- **Election integrity** with transaction-based vote recording

### Admin Security
- **Admin-only endpoints** for election and candidate management
- **Role verification** on all administrative actions
- **Secure image uploads** with file type validation
- **Status change logging** for audit trails

## 🚦 Election Status System

### Status Flow
```
SCHEDULED → ACTIVE → COMPLETED
     ↓         ↓         ↓
  🟠 Orange  🟢 Green  ⚫ Gray
```

### Status Descriptions
- **🟠 Scheduled**: Election created, voting not yet started
- **🟢 Active**: Voting is currently open and accepting votes
- **⚫ Completed**: Voting has ended, results are final

### Automatic Status Updates
- Elections automatically activate when `votingStartTime` arrives
- Elections automatically complete when `votingEndTime` passes
- Status checks run every minute on the server
- Frontend displays real-time countdown timers

## 📱 User Roles & Permissions

### 👤 Voter Permissions
- ✅ View all elections and candidates
- ✅ Vote in active elections (once per election)
- ✅ View real-time results
- ✅ Register and manage own account
- ❌ Create/edit elections or candidates
- ❌ Control voting schedules or status

### 👨‍💼 Admin Permissions
- ✅ All voter permissions, plus:
- ✅ Create/edit/delete elections
- ✅ Add/remove candidates
- ✅ Set voting schedules and durations
- ✅ Start voting immediately (override schedule)
- ✅ Manually change election status
- ✅ View voter lists and election analytics

## 🎯 Usage Examples

### Creating a Scheduled Election
1. **Login as Admin**
2. **Click "Create New Election"**
3. **Fill election details**:
   - Title: "IIT Presidential Election 2024"
   - Description: "Annual student body president election"
   - Start Time: Tomorrow 9:00 AM
   - Duration: 4 hours
   - Upload thumbnail image
4. **Election Status**: 🟠 Scheduled
5. **Voters See**: "Voting starts in 18h 30m"

### Managing Active Voting
1. **Automatic Activation**: Election becomes 🟢 Active at 9:00 AM
2. **Voters Can Vote**: 9:00 AM - 1:00 PM (4 hours)
3. **Real-time Results**: Progress bars update with each vote
4. **Admin Override**: Can end voting early if needed
5. **Automatic Completion**: Status changes to ⚫ Completed at 1:00 PM

### Voting Process
1. **Navigate to Elections** page
2. **Check status**: Ensure election is 🟢 Active
3. **Click "Vote Now"** (only available during voting window)
4. **Select candidate** from candidates page
5. **Confirm vote** in modal popup
6. **Success notification** and redirect to congratulations
7. **Results update** immediately with new vote

## 🌟 Advanced Features

### Real-time Updates
- **Live countdown timers** updating every second
- **Instant result updates** when votes are cast
- **Automatic status synchronization** across all user sessions
- **Progress bar animations** with smooth transitions

### Admin Dashboard Features
- **Quick status overview** of all elections
- **One-click voting control** with "Start Voting Now"
- **Bulk status management** with dropdown controls
- **Visual schedule timeline** showing all election timings

### Mobile-Responsive Design
- **Touch-friendly interfaces** for mobile voting
- **Responsive status badges** that stack on small screens
- **Optimized layouts** for various screen sizes
- **Fast loading** with optimized images from Cloudinary

## 🔧 Development

### Running in Development Mode

**Backend (Terminal 1):**
```bash
cd server
npm start
# Server: http://localhost:3000
```

**Frontend (Terminal 2):**
```bash
cd voting_app
npm run dev
# Frontend: http://localhost:5173
```

### Building for Production

**Frontend:**
```bash
cd voting_app
npm run build
```

### Environment Variables

**Server (.env):**
```env
MONGO_DB_URL=mongodb+srv://username:password@cluster.mongodb.net/voting_app
JWT_SEC=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🎨 Styling & Theming

### Color Scheme
- **Primary Blue**: `rgb(15,89,193)` - Main brand color
- **Success Green**: `rgb(6,164,101)` - Active voting, success states
- **Warning Orange**: `rgb(245,158,11)` - Scheduled elections, warnings
- **Danger Red**: `rgb(246,67,67)` - Error states, delete actions
- **Info Blue**: `rgb(59,130,246)` - Information, links

### Status Color Coding
- 🟠 **Orange**: Scheduled elections (voting not started)
- 🟢 **Green**: Active elections (voting in progress)
- ⚫ **Gray**: Completed elections (voting ended)

## 🐛 Troubleshooting

### Common Issues

**"Upload preset must be whitelisted" Error:**
- ✅ Fixed: Now uses signed uploads with your Cloudinary credentials
- No need to configure upload presets in Cloudinary dashboard

**"undefined" in Election URLs:**
- ✅ Fixed: Components now properly handle MongoDB `_id` fields
- URLs correctly show: `/elections/[actual-election-id]`

**Edit Button Redirects to Sign-in:**
- ✅ Fixed: Improved authentication state management
- Admin status properly preserved across page refreshes

**Voting Time Restrictions:**
- ✅ Implemented: Server enforces voting windows
- Clear error messages when voting outside allowed times

### Performance Notes
- **Image Optimization**: Cloudinary automatically optimizes uploaded images
- **Real-time Updates**: Efficient Redux state management prevents unnecessary re-renders
- **Database Queries**: Optimized MongoDB queries with proper indexing
- **Caching**: Browser caching enabled for static assets

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code structure and naming conventions
- Add comments for complex logic
- Test all authentication and voting flows
- Ensure responsive design on mobile devices
- Update README for new features

## 📞 Support

### For Issues
- Check troubleshooting section above
- Review console logs for error details
- Verify environment variables are set correctly
- Ensure MongoDB connection is active

### Feature Requests
- Open an issue describing the desired feature
- Include use cases and expected behavior
- Consider security implications for voting systems

---

## 📊 System Overview

This voting system provides a complete solution for conducting secure, time-controlled elections with:

- **🔐 Secure Authentication** - JWT-based with role management
- **⏰ Smart Scheduling** - 4-hour voting windows with admin control
- **🗳️ Reliable Voting** - One vote per person with time enforcement  
- **📊 Live Results** - Real-time progress bars and vote counts
- **📱 Responsive UI** - Works perfectly on desktop and mobile
- **🛡️ Admin Controls** - Complete election and candidate management

Built with modern web technologies and best practices for security, performance, and user experience.

---

**Made By Hadeed for Multiple Elections**
