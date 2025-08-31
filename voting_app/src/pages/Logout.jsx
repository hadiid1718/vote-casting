import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { voterActions } from '../store/vote-slice'
import { clearStoredAuth } from '../utils/auth'

const Logout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    // Clear authentication state
    dispatch(voterActions.logout())
    clearStoredAuth()
    
    // Navigate to signup page
    navigate('/register')
  }, [dispatch, navigate])

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '50vh',
      fontSize: '18px'
    }}>
      Logging out...
    </div>
  )
}

export default Logout
