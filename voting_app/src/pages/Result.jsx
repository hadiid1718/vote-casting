import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ResultElection from '../components/ResultElection';
import { fetchElections } from '../store/thunks';
const Result = () => {
  const dispatch = useDispatch()
  const { elections, loading, error, currentVoter } = useSelector(state => state.vote)

  // Fetch elections when component mounts
  useEffect(() => {
    if (currentVoter.token) {
      dispatch(fetchElections())
    }
  }, [currentVoter.token, dispatch])

  return (
    <>
       <section className="results">
        <div className="container results__container">
          <header className="results__header">
            <h1>Election Results</h1>
            <p>View the results of all ongoing and completed elections</p>
          </header>
          {loading && <p>Loading results...</p>}
          {error && <p className="form__error-message">Error: {JSON.stringify(error)}</p>}
          <div className="results__content">
            {
              elections.map(election => <ResultElection key={election._id || election.id} {...election}/>)
            }
          </div>
        </div>
       </section>
    </>
  )
}

export default Result
