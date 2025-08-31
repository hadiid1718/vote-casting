import React, { useEffect } from 'react'
import Election from '../components/Election'
import AddElectionModal from '../components/AddElectionModal'
import { useDispatch, useSelector } from 'react-redux'
import { uiActions } from '../store/ui-slice'
import UpdateElectionModal from '../components/UpdateElectionModal'
import { fetchElections } from '../store/thunks'

const Elections = () => {
  const dispatch = useDispatch()
  const { elections, loading, error, currentVoter } = useSelector(state => state.vote)
  const electionModalShowing = useSelector( state => state.ui.electionModalShowing)
  const updateElectionModalShowing = useSelector( state => state.ui.updateElectionModalShowing)
  
  // Fetch elections when component mounts or when user logs in
  useEffect(() => {
    if (currentVoter.token) {
      dispatch(fetchElections())
    }
  }, [currentVoter.token, dispatch])

  const openModal = () => {  
    dispatch(uiActions.openElectionModal())
  }

  return (
    <>
        <section className="elections">
          <div className="container elections__container">
          <header className="elections__header">
            <h1>OnGoing Elections</h1>
            {currentVoter.isAdmin && (
              <button className="btn primary" onClick={openModal}>Create New Election</button>
            )}
          </header>
            {loading && <p>Loading elections...</p>}
            {error && <p className="form__error-message">Error: {JSON.stringify(error)}</p>}
            <menu className="elections__menu">
              {
                elections.map(election => <Election key={election._id || election.id} {...election} />)
              }
            </menu>
          </div>
        </section>
        {electionModalShowing && < AddElectionModal/>}
        {updateElectionModalShowing && < UpdateElectionModal/>}
    </>
  )
}

export default Elections
