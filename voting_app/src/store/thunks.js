import { createAsyncThunk } from '@reduxjs/toolkit';
import { voterService, electionService, candidateService } from '../services';

// Voter Thunks
export const registerVoter = createAsyncThunk(
  'voter/register',
  async (voterData, { rejectWithValue }) => {
    try {
      const response = await voterService.register(voterData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const loginVoter = createAsyncThunk(
  'voter/login',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await voterService.login(loginData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchVoter = createAsyncThunk(
  'voter/fetchVoter',
  async (voterId, { rejectWithValue }) => {
    try {
      const response = await voterService.getVoter(voterId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Election Thunks
export const fetchElections = createAsyncThunk(
  'elections/fetchElections',
  async (_, { rejectWithValue }) => {
    try {
      const response = await electionService.getElections();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchElection = createAsyncThunk(
  'elections/fetchElection',
  async (electionId, { rejectWithValue }) => {
    try {
      const response = await electionService.getElection(electionId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createElection = createAsyncThunk(
  'elections/createElection',
  async (electionData, { rejectWithValue }) => {
    try {
      const response = await electionService.addElection(electionData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateElection = createAsyncThunk(
  'elections/updateElection',
  async ({ electionId, electionData }, { rejectWithValue }) => {
    try {
      const response = await electionService.updateElection(electionId, electionData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteElection = createAsyncThunk(
  'elections/deleteElection',
  async (electionId, { rejectWithValue }) => {
    try {
      await electionService.deleteElection(electionId);
      return electionId;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchElectionCandidates = createAsyncThunk(
  'elections/fetchElectionCandidates',
  async (electionId, { rejectWithValue }) => {
    try {
      const response = await electionService.getElectionCandidates(electionId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchElectionVoters = createAsyncThunk(
  'elections/fetchElectionVoters',
  async (electionId, { rejectWithValue }) => {
    try {
      const response = await electionService.getElectionVoters(electionId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateElectionStatus = createAsyncThunk(
  'elections/updateElectionStatus',
  async ({ electionId, status }, { rejectWithValue }) => {
    try {
      const response = await electionService.updateElectionStatus(electionId, status);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const startVoting = createAsyncThunk(
  'elections/startVoting',
  async (electionId, { rejectWithValue }) => {
    try {
      const response = await electionService.startVoting(electionId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Candidate Thunks
export const addCandidate = createAsyncThunk(
  'candidates/addCandidate',
  async (candidateData, { rejectWithValue }) => {
    try {
      const response = await candidateService.addCandidate(candidateData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchCandidate = createAsyncThunk(
  'candidates/fetchCandidate',
  async (candidateId, { rejectWithValue }) => {
    try {
      const response = await candidateService.getCandidate(candidateId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const removeCandidate = createAsyncThunk(
  'candidates/removeCandidate',
  async (candidateId, { rejectWithValue }) => {
    try {
      await candidateService.removeCandidate(candidateId);
      return candidateId;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const voteForCandidate = createAsyncThunk(
  'candidates/voteForCandidate',
  async ({ candidateId, voteData }, { rejectWithValue }) => {
    try {
      const response = await candidateService.voteCandidate(candidateId, voteData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Student Management Thunks
export const addStudent = createAsyncThunk(
  'students/addStudent',
  async (studentData, { rejectWithValue }) => {
    try {
      const response = await voterService.addStudent(studentData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchAllStudents = createAsyncThunk(
  'students/fetchAllStudents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await voterService.getAllStudents();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateStudent = createAsyncThunk(
  'students/updateStudent',
  async ({ studentId, studentData }, { rejectWithValue }) => {
    try {
      const response = await voterService.updateStudent(studentId, studentData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteStudent = createAsyncThunk(
  'students/deleteStudent',
  async (studentId, { rejectWithValue }) => {
    try {
      await voterService.deleteStudent(studentId);
      return studentId;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
