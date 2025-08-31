import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginVoter,
  registerVoter,
  fetchElections,
  fetchElectionCandidates,
  addCandidate,
  voteForCandidate,
  createElection,
} from '../store/thunks';
import { voterActions } from '../store/vote-slice';

// Example component showing how to use the API integration
const ApiUsageExample = () => {
  const dispatch = useDispatch();
  const { currentVoter, elections, candidates, loading, error } = useSelector(
    (state) => state.vote
  );

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  // Example: Fetch elections on component mount
  useEffect(() => {
    if (currentVoter.token) {
      dispatch(fetchElections());
    }
  }, [currentVoter.token, dispatch]);

  // Example: Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginVoter(loginForm)).unwrap();
      // Login successful - the Redux state will be updated automatically
      console.log('Login successful!');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Example: Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await dispatch(registerVoter(registerForm)).unwrap();
      console.log('Registration successful!');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  // Example: Handle logout
  const handleLogout = () => {
    dispatch(voterActions.logout());
  };

  // Example: Create new election
  const handleCreateElection = async () => {
    const electionData = {
      title: 'Sample Election',
      description: 'This is a sample election',
      // Add other required fields
    };

    try {
      await dispatch(createElection(electionData)).unwrap();
      console.log('Election created successfully!');
    } catch (error) {
      console.error('Failed to create election:', error);
    }
  };

  // Example: Add candidate to election
  const handleAddCandidate = async (electionId) => {
    const candidateData = {
      fullName: 'John Doe',
      motto: 'Vote for change!',
      election: electionId,
      // Add image file if needed
    };

    try {
      await dispatch(addCandidate(candidateData)).unwrap();
      console.log('Candidate added successfully!');
    } catch (error) {
      console.error('Failed to add candidate:', error);
    }
  };

  // Example: Vote for a candidate
  const handleVote = async (candidateId) => {
    const voteData = {
      voterId: currentVoter.id,
      // Add other required voting data
    };

    try {
      await dispatch(voteForCandidate({ candidateId, voteData })).unwrap();
      console.log('Vote cast successfully!');
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  // Example: Fetch candidates for a specific election
  const handleFetchCandidates = async (electionId) => {
    try {
      await dispatch(fetchElectionCandidates(electionId)).unwrap();
      console.log('Candidates fetched successfully!');
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>API Usage Examples</h1>
      
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {JSON.stringify(error)}</p>}

      {!currentVoter.token ? (
        <div>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              required
            />
            <button type="submit">Login</button>
          </form>

          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Full Name"
              value={registerForm.fullName}
              onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              required
            />
            <button type="submit">Register</button>
          </form>
        </div>
      ) : (
        <div>
          <h2>Welcome, {currentVoter.fullName || currentVoter.email}!</h2>
          <button onClick={handleLogout}>Logout</button>
          
          <h3>Elections</h3>
          <button onClick={handleCreateElection}>Create Sample Election</button>
          
          <div>
            {elections.map((election) => (
              <div key={election._id || election.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                <h4>{election.title}</h4>
                <p>{election.description}</p>
                <button onClick={() => handleFetchCandidates(election._id || election.id)}>
                  Load Candidates
                </button>
                <button onClick={() => handleAddCandidate(election._id || election.id)}>
                  Add Sample Candidate
                </button>
              </div>
            ))}
          </div>

          <h3>Candidates</h3>
          <div>
            {candidates.map((candidate) => (
              <div key={candidate._id || candidate.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                <h4>{candidate.fullName}</h4>
                <p>{candidate.motto}</p>
                <p>Votes: {candidate.voteCount || 0}</p>
                <button onClick={() => handleVote(candidate._id || candidate.id)}>
                  Vote
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiUsageExample;
