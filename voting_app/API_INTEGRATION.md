# API Integration Setup

This document explains how to use the backend APIs in your React frontend.

## Overview

The integration includes:
- **Backend Server**: Express.js server running on `http://localhost:3000`
- **Frontend App**: React app with Vite running on `http://localhost:5173`
- **API Communication**: Axios with Redux Toolkit for state management

## Available APIs

### Voter APIs
- `POST /api/voters/register` - Register new voter
- `POST /api/voters/login` - Login voter
- `GET /api/voters/:id` - Get voter details (requires auth)

### Election APIs
- `POST /api/elections` - Create election (requires auth)
- `GET /api/elections` - Get all elections (requires auth)
- `GET /api/elections/:id` - Get specific election (requires auth)
- `PATCH /api/elections/:id` - Update election (requires auth)
- `DELETE /api/election/:id` - Delete election (requires auth)
- `GET /api/elections/:id/candidates` - Get election candidates (requires auth)
- `GET /api/elections/:id/voters` - Get election voters (requires auth)

### Candidate APIs
- `POST /api/candidates` - Add candidate (requires auth)
- `GET /api/candidates/:id` - Get candidate (requires auth)
- `DELETE /api/candidates/:id` - Remove candidate (requires auth)
- `PATCH /api/candidates/:id` - Vote for candidate (requires auth)

## How to Use

### 1. Start Both Servers

**Start Backend Server:**
```bash
# In the server folder
cd E:\project\voting\server
npm run dev
```

**Start Frontend Server:**
```bash
# In the voting_app folder
cd E:\project\voting\voting_app
npm run dev
```

### 2. Using APIs in Components

#### Import Required Functions
```jsx
import { useDispatch, useSelector } from 'react-redux';
import { loginVoter, fetchElections, addCandidate } from '../store/thunks';
```

#### Get State from Redux
```jsx
const { currentVoter, elections, candidates, loading, error } = useSelector(
  (state) => state.vote
);
```

#### Example: Login
```jsx
const handleLogin = async (loginData) => {
  try {
    await dispatch(loginVoter(loginData)).unwrap();
    console.log('Login successful!');
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

#### Example: Fetch Elections
```jsx
useEffect(() => {
  if (currentVoter.token) {
    dispatch(fetchElections());
  }
}, [currentVoter.token, dispatch]);
```

#### Example: Create Election
```jsx
const handleCreateElection = async (electionData) => {
  try {
    await dispatch(createElection(electionData)).unwrap();
    console.log('Election created!');
  } catch (error) {
    console.error('Failed to create election:', error);
  }
};
```

#### Example: Vote for Candidate
```jsx
const handleVote = async (candidateId) => {
  const voteData = { voterId: currentVoter.id };
  try {
    await dispatch(voteForCandidate({ candidateId, voteData })).unwrap();
    console.log('Vote cast successfully!');
  } catch (error) {
    console.error('Failed to vote:', error);
  }
};
```

### 3. Authentication

The system uses JWT tokens for authentication:
- Tokens are automatically stored in localStorage after login
- Tokens are automatically attached to API requests
- If a token expires (401 response), user is redirected to login

### 4. Error Handling

All API calls include error handling:
- Loading states are managed in Redux
- Errors are captured and stored in Redux state
- Network errors and API errors are handled gracefully

### 5. File Uploads

For candidate images and other file uploads:
```jsx
const candidateData = {
  fullName: 'John Doe',
  motto: 'Vote for change!',
  election: electionId,
  image: fileObject // File object from input[type="file"]
};

dispatch(addCandidate(candidateData));
```

## Environment Configuration

Make sure your `.env` file in the `src` folder contains:
```
VITE_API_URL=http://localhost:3000/api
```

## Files Created

1. `src/services/api.js` - Axios configuration
2. `src/services/voterService.js` - Voter API functions
3. `src/services/electionService.js` - Election API functions
4. `src/services/candidateService.js` - Candidate API functions
5. `src/services/index.js` - Service exports
6. `src/store/thunks.js` - Redux async thunks
7. `src/examples/ApiUsageExample.jsx` - Usage examples

## Next Steps

1. Replace mock data in your existing components with API calls
2. Update your existing Login, Register, Elections, and Candidates components
3. Test the integration by running both servers
4. Handle loading and error states in your UI components

## Testing the Integration

You can use the `ApiUsageExample` component to test the integration:

1. Import it in your main App or add it to your routes
2. Start both servers
3. Test login, registration, and other operations
4. Check the browser's Network tab to see API calls being made
