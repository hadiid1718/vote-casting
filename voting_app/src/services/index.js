// Main service exports
export { voterService } from './voterService';
export { electionService } from './electionService';
export { candidateService } from './candidateService';
export { blogService } from './blogService';
export { default as api } from './api';

// Import for convenience exports
import { electionService } from './electionService';

// Convenience exports
export const getElections = electionService.getElections;
