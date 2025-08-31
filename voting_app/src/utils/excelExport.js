import * as XLSX from 'xlsx';

/**
 * Export voter data to Excel file
 * @param {Array} voters - Array of voter objects
 * @param {string} electionTitle - Title of the election for filename
 */
export const exportVotersToExcel = (voters, electionTitle = 'Election') => {
  try {
    // Prepare data for Excel export
    const exportData = voters.map((voter, index) => ({
      'S.No': index + 1,
      'Voter ID': voter._id || voter.id || 'N/A',
      'Name': voter.fullName || voter.name || 'N/A',
      'Email': voter.email || 'N/A',
      'Registration Date': voter.createdAt ? new Date(voter.createdAt).toLocaleDateString() : 'N/A',
      'Voting Status': voter.hasVoted ? 'Voted' : 'Not Voted',
      'Vote Time': voter.voteTime ? new Date(voter.voteTime).toLocaleString() : 'N/A'
    }));

    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Create worksheet from data
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Set column widths for better formatting
    const columnWidths = [
      { wch: 8 },   // S.No
      { wch: 25 },  // Voter ID
      { wch: 20 },  // Name
      { wch: 30 },  // Email
      { wch: 15 },  // Registration Date
      { wch: 12 },  // Voting Status
      { wch: 18 }   // Vote Time
    ];
    worksheet['!cols'] = columnWidths;
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Voters');
    
    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0];
    const sanitizedTitle = electionTitle.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${sanitizedTitle}_Voters_${currentDate}.xlsx`;
    
    // Write and download the file
    XLSX.writeFile(workbook, filename);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Excel export error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Export election summary with candidate votes to Excel
 * @param {Object} election - Election object
 * @param {Array} candidates - Array of candidate objects with vote counts
 * @param {Array} voters - Array of voter objects
 */
export const exportElectionSummaryToExcel = (election, candidates, voters) => {
  try {
    const workbook = XLSX.utils.book_new();
    
    // Election Summary Sheet
    const summaryData = [
      ['Election Title', election.title],
      ['Description', election.description],
      ['Voting Start Time', new Date(election.votingStartTime).toLocaleString()],
      ['Voting End Time', new Date(election.votingEndTime).toLocaleString()],
      ['Duration (Hours)', election.duration],
      ['Status', election.status],
      ['Total Candidates', candidates.length],
      ['Total Registered Voters', voters.length],
      ['Total Votes Cast', voters.filter(v => v.hasVoted).length],
      ['Voter Turnout %', voters.length > 0 ? ((voters.filter(v => v.hasVoted).length / voters.length) * 100).toFixed(2) + '%' : '0%']
    ];
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    summarySheet['!cols'] = [{ wch: 20 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    
    // Candidates Results Sheet
    const candidatesData = candidates.map((candidate, index) => ({
      'Rank': index + 1,
      'Candidate Name': candidate.fullName || 'N/A',
      'Motto': candidate.motto || 'N/A',
      'Total Votes': candidate.votes || 0,
      'Vote Percentage': candidates.reduce((total, c) => total + (c.votes || 0), 0) > 0 
        ? ((candidate.votes || 0) / candidates.reduce((total, c) => total + (c.votes || 0), 0) * 100).toFixed(2) + '%'
        : '0%'
    }));
    
    const candidatesSheet = XLSX.utils.json_to_sheet(candidatesData);
    candidatesSheet['!cols'] = [{ wch: 8 }, { wch: 25 }, { wch: 30 }, { wch: 12 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(workbook, candidatesSheet, 'Results');
    
    // Voters Sheet
    const votersData = voters.map((voter, index) => ({
      'S.No': index + 1,
      'Voter ID': voter._id || voter.id || 'N/A',
      'Name': voter.fullName || voter.name || 'N/A',
      'Email': voter.email || 'N/A',
      'Registration Date': voter.createdAt ? new Date(voter.createdAt).toLocaleDateString() : 'N/A',
      'Voting Status': voter.hasVoted ? 'Voted' : 'Not Voted',
      'Vote Time': voter.voteTime ? new Date(voter.voteTime).toLocaleString() : 'N/A'
    }));
    
    const votersSheet = XLSX.utils.json_to_sheet(votersData);
    votersSheet['!cols'] = [{ wch: 8 }, { wch: 25 }, { wch: 20 }, { wch: 30 }, { wch: 15 }, { wch: 12 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(workbook, votersSheet, 'Voters');
    
    // Generate filename
    const currentDate = new Date().toISOString().split('T')[0];
    const sanitizedTitle = election.title.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${sanitizedTitle}_Complete_Report_${currentDate}.xlsx`;
    
    // Write and download the file
    XLSX.writeFile(workbook, filename);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Excel export error:', error);
    return { success: false, error: error.message };
  }
};
