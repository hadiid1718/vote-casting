# 🗳️ Digital Voting Platform

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green.svg)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.x-grey.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive digital voting platform featuring secure elections, real-time results, and an integrated blog management system for announcements and community engagement.

## 🌟 Features

### 🗳️ **Voting System**
- **Secure Authentication**: JWT-based user authentication with role-based access control
- **Digital Elections**: Create and manage elections with multiple candidates
- **Real-time Results**: Live vote counting and results visualization
- **Voter Management**: User registration, profile management, and voting history
- **Admin Dashboard**: Complete election oversight and management tools
- **Vote Security**: One-vote-per-user with tamper-proof recording

### 📝 **Blog Management System**
- **Content Creation**: Rich text editor with image upload support
- **Public Viewing**: Accessible to both authenticated and guest users
- **Real View Tracking**: Accurate blog view counters stored in database
- **Interactive Features**: Like and comment system (requires authentication)
- **Winner Announcements**: Special blog posts for election results
- **Content Management**: Full CRUD operations for admins
- **Responsive Design**: Mobile-optimized for all screen sizes

### 🔐 **Security & Authentication**
- **JWT Tokens**: Secure session management
- **Role-based Access**: Admin, Voter, and Guest permissions
- **Input Validation**: Comprehensive server and client-side validation
- **CORS Protection**: Secure cross-origin resource sharing
- **Image Upload Security**: File type and size validation

### 📱 **User Experience**
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Real-time Feedback**: Toast notifications and loading states
- **Touch-friendly**: Mobile-optimized buttons and interactions
- **Accessibility**: Focus states and semantic HTML structure

## 🛠️ Technology Stack

### **Frontend**
- **React 18.x**: Modern UI library with hooks and context
- **Vite**: Fast build tool and development server
- **Redux Toolkit**: State management with RTK Query
- **React Router**: Client-side routing and navigation
- **React Icons**: Comprehensive icon library
- **React Toastify**: User notification system
- **Axios**: HTTP client for API requests

### **Backend**
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for data persistence
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT**: JSON Web Token for authentication
- **Cloudinary**: Cloud-based image storage and optimization
- **Express File Upload**: File upload middleware
- **CORS**: Cross-Origin Resource Sharing middleware

### **Database Schema**
- **Users (Voters)**: Authentication and profile data
- **Elections**: Election metadata and configuration
- **Candidates**: Candidate information and vote counts
- **Blogs**: Blog posts with content, metadata, and engagement stats
- **Comments**: Nested comment system with likes

## 🚀 Installation & Setup

### **Prerequisites**
- Node.js 18.x or higher
- npm or yarn package manager
- MongoDB 6.x (local or cloud instance)
- Cloudinary account (for image storage)

### **Environment Setup**

1. **Clone the repository**
```bash
git clone https://github.com/your-username/voting-platform.git
cd voting-platform
```

2. **Backend Setup**
```bash
cd server
npm install
```

Create `.env` file in the server directory:
```env
# Database
MONGO_URI=mongodb://localhost:27017/voting-platform
# or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/voting-platform

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Server Configuration
PORT=3000
NODE_ENV=development
```

3. **Frontend Setup**
```bash
cd ../voting_app
npm install
```

Create `.env` file in the voting_app directory:
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=Digital Voting Platform
```

### **Running the Application**

1. **Start MongoDB** (if using local instance)
```bash
mongod
```

2. **Start the Backend Server**
```bash
cd server
npm start
# Server runs on http://localhost:3000
```

3. **Start the Frontend Development Server**
```bash
cd voting_app
npm run dev
# Frontend runs on http://localhost:5173 or http://localhost:5174
```

4. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`

## 📖 Usage Guide

### **For Voters**
1. **Registration**: Create an account with email and personal details
2. **Login**: Authenticate to access voting features
3. **Browse Elections**: View available elections and candidates
4. **Cast Vote**: Select your preferred candidate (one vote per election)
5. **View Results**: See real-time election results
6. **Explore Blogs**: Read announcements and community content
7. **Engage**: Like and comment on blog posts

### **For Administrators**
1. **Election Management**:
   - Create new elections with title, description, and dates
   - Add candidates with photos, names, and campaign information
   - Monitor voting progress and results
   - Archive completed elections

2. **Content Management**:
   - Create blog posts with rich text and images
   - Manage comments and user engagement
   - Publish winner announcements
   - Track blog analytics (views, likes, comments)

3. **User Management**:
   - Monitor user registrations
   - Manage user roles and permissions
   - View voting statistics and participation

### **Guest Users**
- Browse and read all blog content
- View blog statistics (likes, comments, views)
- Access public election information
- Register for an account to participate

## 🔧 API Endpoints

### **Authentication**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile

### **Elections**
- `GET /elections` - List all elections
- `POST /elections` - Create election (admin)
- `GET /elections/:id` - Get election details
- `POST /elections/:id/vote` - Cast vote

### **Candidates**
- `GET /elections/:id/candidates` - List candidates
- `POST /candidates` - Add candidate (admin)

### **Blogs**
- `GET /blogs` - List blogs (public)
- `GET /blogs/:id` - Get blog details (public, tracks views)
- `POST /blogs` - Create blog (admin)
- `PATCH /blogs/:id/like` - Toggle like (authenticated)
- `GET /blogs/:id/comments` - Get comments (public)
- `POST /blogs/:id/comments` - Add comment (authenticated)

## 🎨 Key Components

### **Frontend Architecture**
```
src/
├── components/          # Reusable UI components
│   ├── BlogCard.jsx    # Blog preview cards
│   ├── CommentModal.jsx # Comment popup modal
│   └── Navigation.jsx   # App navigation
├── pages/               # Main application pages
│   ├── BlogList.jsx    # Blog listing with filters
│   ├── BlogDetail.jsx  # Individual blog view
│   ├── CreateBlog.jsx  # Blog creation form
│   ├── Login.jsx       # Authentication
│   └── Dashboard.jsx   # Voting interface
├── services/            # API integration
│   ├── api.js          # Axios configuration
│   ├── blogService.js  # Blog API calls
│   └── authService.js  # Authentication APIs
├── store/               # Redux state management
│   ├── blog-slice.js   # Blog state and actions
│   └── auth-slice.js   # Authentication state
└── styles/              # CSS and styling
    └── App.css         # Main application styles
```

### **Backend Architecture**
```
server/
├── controllers/         # Request handlers
│   ├── authController.js
│   ├── blogController.js
│   └── electionController.js
├── models/              # Database schemas
│   ├── voterModel.js
│   ├── blogModel.js
│   └── electionModel.js
├── routes/              # API route definitions
├── middleware/          # Custom middleware
│   └── authMiddleware.js
└── utils/               # Utility functions
    └── cloudinary.js
```

## 📱 Mobile Responsiveness

The application is fully optimized for mobile devices with:

- **Touch-friendly interactions**: Buttons sized for easy tapping (44px minimum)
- **Responsive grid layouts**: Adapts from multi-column to single-column on small screens
- **Mobile-first design**: Progressive enhancement for larger screens
- **Optimized forms**: Stack labels and inputs vertically on mobile
- **Gesture support**: Swipe and touch interactions where appropriate
- **Performance optimization**: Lazy loading and optimized images

### **Breakpoints**
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 480px - 767px
- **Small Mobile**: 360px - 479px

## 🔒 Security Features

- **Authentication**: JWT-based secure token system
- **Authorization**: Role-based access control (Admin/Voter/Guest)
- **Input Validation**: Server and client-side validation
- **File Upload Security**: Type and size restrictions
- **CORS Configuration**: Controlled cross-origin requests
- **Environment Variables**: Sensitive data protection
- **Password Security**: Hashed password storage
- **SQL Injection Prevention**: MongoDB parameterized queries

## 🚀 Deployment

### **Frontend Deployment (Vercel/Netlify)**
```bash
cd voting_app
npm run build
# Deploy the dist/ folder
```

### **Backend Deployment (Heroku/Railway)**
```bash
cd server
# Set environment variables in hosting platform
# Deploy with start script: "node index.js"
```

### **Database Deployment**
- Use MongoDB Atlas for cloud database
- Update MONGO_URI in production environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

### **Development Guidelines**
- Follow React best practices and hooks patterns
- Use Redux Toolkit for state management
- Implement responsive design with mobile-first approach
- Add proper error handling and user feedback
- Write clean, documented code with comments
- Test functionality across different screen sizes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- React team for the excellent framework
- MongoDB for reliable database solution
- Cloudinary for image storage and optimization
- Open source community for inspiration and tools

## 📞 Support

For support, email support@votingplatform.com or join our [Discord community](https://discord.gg/votingplatform).

## 🔮 Future Enhancements

- [ ] Multi-language support (i18n)
- [ ] Advanced analytics dashboard
- [ ] Email notifications for election updates
- [ ] Social media sharing integration
- [ ] Progressive Web App (PWA) features
- [ ] Advanced blog editor with markdown support
- [ ] User profile customization
- [ ] Election scheduling and automation
- [ ] Blockchain-based vote verification
- [ ] Advanced reporting and export features

---

**Built with ❤️ using React, Node.js, and MongoDB**
