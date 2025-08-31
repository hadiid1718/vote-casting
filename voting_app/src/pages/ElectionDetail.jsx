import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ElectionCandidate from '../components/ElectionCandidate'
import { IoMdAddCircleOutline, IoMdDownload, IoMdPeople } from 'react-icons/io'
import { useDispatch, useSelector } from "react-redux"
import { uiActions } from "../store/ui-slice"
import { voterActions } from "../store/vote-slice"
import AddCandidateModal from '../components/AddCandidateModal'
import { fetchElection, fetchElectionCandidates, fetchElectionVoters } from '../store/thunks'
import { exportVotersToExcel, exportElectionSummaryToExcel } from '../utils/excelExport'
import { toast } from 'react-toastify'

const ElectionDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentElection, candidates, voters, loading, error, currentVoter } = useSelector(state => state.vote)
  const openAddCandidateModal = useSelector(state => state.ui.addCandidateModalShowing)
  const [showVoters, setShowVoters] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(Date.now())

  // Fetch election details, candidates, and voters when component mounts
  useEffect(() => {
    if (currentVoter.token && id) {
      dispatch(fetchElection(id))
      dispatch(fetchElectionCandidates(id))
      // Fetch voters if user is admin
      if (currentVoter.isAdmin) {
        dispatch(fetchElectionVoters(id))
      }
      // Set the election ID for adding candidates
      dispatch(voterActions.changeAddCandidateElectionId(id))
    }
  }, [currentVoter.token, currentVoter.isAdmin, id, dispatch])
  
  // Auto-refresh voter data periodically when viewing voters
  useEffect(() => {
    if (currentVoter.isAdmin && showVoters && id) {
      const interval = setInterval(() => {
        dispatch(fetchElectionVoters(id))
      }, 10000) // Refresh every 10 seconds
      
      return () => clearInterval(interval)
    }
  }, [currentVoter.isAdmin, showVoters, id, dispatch])

  const openModal = () => {
    dispatch(uiActions.openAddCandidateModal());
  }
  
  const handleExportVoters = () => {
    if (!voters || voters.length === 0) {
      toast.warning('No voter data available to export');
      return;
    }
    
    const result = exportVotersToExcel(voters, currentElection?.title || 'Election');
    if (result.success) {
      toast.success(`Voter data exported successfully: ${result.filename}`);
    } else {
      toast.error(`Export failed: ${result.error}`);
    }
  }
  
  const handleExportComplete = () => {
    if (!currentElection || !candidates || !voters) {
      toast.warning('Data not available for complete export');
      return;
    }
    
    const result = exportElectionSummaryToExcel(currentElection, candidates, voters);
    if (result.success) {
      toast.success(`Complete election report exported: ${result.filename}`);
    } else {
      toast.error(`Export failed: ${result.error}`);
    }
  }
  
  const handleRefreshVoters = () => {
    if (currentVoter.isAdmin && id) {
      dispatch(fetchElectionVoters(id))
      setLastRefresh(Date.now())
      toast.info('Voter data refreshed')
    }
  }
  
  const handleResetVotes = async () => {
    if (!currentVoter.isAdmin || !id) return
    
    if (window.confirm('Are you sure you want to reset all votes for this election? This action cannot be undone.')) {
      try {
        const response = await fetch(`http://localhost:3000/api/elections/${id}/votes`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${currentVoter.token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          toast.success('All votes have been reset')
          // Refresh all data
          dispatch(fetchElectionCandidates(id))
          dispatch(fetchElectionVoters(id))
        } else {
          const errorData = await response.json()
          toast.error(`Failed to reset votes: ${errorData.message || 'Unknown error'}`)
        }
      } catch (error) {
        toast.error(`Error resetting votes: ${error.message}`)
      }
    }
  }
  if (loading) {
    return <div className="container"><p>Loading election details...</p></div>;
  }

  if (error) {
    return <div className="container"><p className="form__error-message">Error: {JSON.stringify(error)}</p></div>;
  }

  if (!currentElection) {
    return <div className="container"><p>Election not found</p></div>;
  }

  return (
    <>
      <section className="electionDetails">
        <div className="container electionDetails__container">
          <h2>{currentElection.title}</h2>
          <p>{currentElection.description}</p>
          <div className="electionDetails__image">
            <img src={currentElection.thumbnail} alt={currentElection.title} />
          </div>
          <menu className="electionDetails__candidates">
            {
              candidates.map(candidate => <ElectionCandidate key={candidate._id || candidate.id} {...candidate} />)
            }
            {currentVoter.isAdmin && (
              <button className="add__candidate-btn" onClick={openModal}><IoMdAddCircleOutline/></button>
            )}
          </menu>
          {currentVoter.isAdmin && (
            <menu className='voters'>
              <div className="voters__header">
                <div className="voters__title">
                  <h2><IoMdPeople /> Voters ({voters.length})</h2>
                  <p>Registered voters for this election</p>
                </div>
                <div className="voters__actions">
                  <button 
                    className="btn sm info" 
                    onClick={() => setShowVoters(!showVoters)}
                  >
                    {showVoters ? 'Hide Voters' : 'Show Voters'}
                  </button>
                  {showVoters && (
                    <button 
                      className="btn sm secondary" 
                      onClick={handleRefreshVoters}
                      title="Refresh voter data"
                    >
                      🔄 Refresh
                    </button>
                  )}
                  {voters.length > 0 && (
                    <>
                      <button 
                        className="btn sm success" 
                        onClick={handleExportVoters}
                        title="Export voter list to Excel"
                      >
                        <IoMdDownload /> Export Voters
                      </button>
                      <button 
                        className="btn sm primary" 
                        onClick={handleExportComplete}
                        title="Export complete election report"
                      >
                        <IoMdDownload /> Complete Report
                      </button>
                      <button 
                        className="btn sm danger" 
                        onClick={handleResetVotes}
                        title="Reset all votes for this election (Testing only)"
                        style={{ marginLeft: '8px' }}
                      >
                        🗑️ Reset Votes
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {showVoters && (
                <div className="voters__table-container">
                  {loading && <p>Loading voter data...</p>}
                  {error && <p className="form__error-message">Error loading voters: {JSON.stringify(error)}</p>}
                  
                  {voters.length === 0 && !loading && (
                    <div className="no-voters">
                      <p>No voters registered for this election yet.</p>
                    </div>
                  )}
                  
                  {voters.length > 0 && (
                    <table className="voters__table">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Registration Date</th>
                          <th>Voting Status</th>
                          <th>Vote Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {voters.map((voter, index) => (
                          <tr key={voter._id || voter.id || index}>
                            <td>{index + 1}</td>
                            <td>{voter.fullName || voter.name || 'N/A'}</td>
                            <td>{voter.email || 'N/A'}</td>
                            <td>
                              {voter.createdAt 
                                ? new Date(voter.createdAt).toLocaleDateString()
                                : 'N/A'
                              }
                            </td>
                            <td>
                              <span className={`status-badge ${voter.hasVoted ? 'voted' : 'not-voted'}`}>
                                {voter.hasVoted ? '✅ Voted' : '⏳ Not Voted'}
                              </span>
                            </td>
                            <td>
                              {voter.voteTime 
                                ? new Date(voter.voteTime).toLocaleString()
                                : 'N/A'
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  
                  {voters.length > 0 && (
                    <div className="voters__summary">
                      <div className="summary-stats">
                        <div className="stat">
                          <strong>{voters.length}</strong>
                          <span>Total Registered</span>
                        </div>
                        <div className="stat">
                          <strong>{voters.filter(v => v.hasVoted).length}</strong>
                          <span>Votes Cast</span>
                        </div>
                        <div className="stat">
                          <strong>
                            {voters.length > 0 
                              ? ((voters.filter(v => v.hasVoted).length / voters.length) * 100).toFixed(1)
                              : 0
                            }%
                          </strong>
                          <span>Turnout Rate</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </menu>
          )}
        </div>
      </section>
      {openAddCandidateModal && <AddCandidateModal/>} 
    </>
  )
}

export default ElectionDetail
