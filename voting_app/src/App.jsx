import { Outlet, useNavigate } from "react-router-dom"
import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import Navbar from "./components/Navbar"
import SessionManager from "./components/SessionManager"
import { voterActions } from "./store/vote-slice"
import { getStoredAuth } from "./utils/auth"
import { checkImmediateServerRestart, initializeServerMonitor, stopServerMonitor } from "./utils/serverMonitor"
import { useAdminData } from "./hooks/useAdminData"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentVoter } = useSelector(state => state.vote)
  const monitorIntervalRef = useRef(null)
  
  // Automatically fetch admin data when admin logs in
  const { isAdmin, isAuthenticated, studentsLoaded } = useAdminData()

  // Initialize theme on app load
  useEffect(() => {
    const theme = localStorage.getItem('voting-app-theme')
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
      document.body.className = 'dark'
    } else {
      document.documentElement.removeAttribute('data-theme')
      document.body.className = ''
    }
  }, [])

  // Handle auto-logout when server restarts
  const handleServerRestart = () => {
    toast.warn('Server restarted. You have been logged out for security.', {
      autoClose: 5000
    })
    dispatch(voterActions.logout())
    navigate('/login')
  }

  // Initialize server monitoring (session restoration is now handled by SessionManager)
  // useEffect(() => {
  //   const initializeApp = async () => {
  //     // Check if server restarted while user was logged in
  //     const storedAuth = getStoredAuth()
  //     if (storedAuth && storedAuth.token) {
  //       const serverRestarted = await checkImmediateServerRestart()
        
  //       if (serverRestarted) {
  //         // Auto-logout due to server restart
  //         handleServerRestart()
  //         return
  //       }
  //     }
  //   }
    
  //   initializeApp()
  // }, [dispatch, navigate])

  // Start server monitoring when user is logged in
  // useEffect(() => {
  //   if (currentVoter.token && !monitorIntervalRef.current) {
  //     // Start monitoring server restarts
  //     const checkServerPeriodically = async () => {
  //       try {
  //         const response = await fetch('http://localhost:3000/api/test', {
  //           method: 'GET',
  //           cache: 'no-cache'
  //         })
          
  //         if (response.ok) {
  //           const data = await response.json()
  //           const currentServerTime = data.timestamp
  //           const storedServerTime = localStorage.getItem('serverStartTime')
            
  //           if (storedServerTime && currentServerTime) {
  //             const storedTime = new Date(storedServerTime)
  //             const currentTime = new Date(currentServerTime)
  //             const timeDiff = Math.abs(currentTime - storedTime)
              
  //             // If server time difference is significant, server likely restarted
  //             if (timeDiff > 60000) { // 1 minute threshold
  //               handleServerRestart()
  //               return
  //             }
  //           }
            
  //           // Update stored server time
  //           localStorage.setItem('serverStartTime', currentServerTime)
  //         }
  //       } catch (error) {
  //         // Server might be down, don't auto-logout for network errors
  //         console.log('Server monitor check failed:', error.message)
  //       }
  //     }
      
  //     // Check every 3 minutes
  //     monitorIntervalRef.current = setInterval(checkServerPeriodically, 180000)
  //   } else if (!currentVoter.token && monitorIntervalRef.current) {
  //     // Stop monitoring when user logs out
  //     clearInterval(monitorIntervalRef.current)
  //     monitorIntervalRef.current = null
  //     localStorage.removeItem('serverStartTime')
  //   }

  //   // Cleanup on unmount
  //   return () => {
  //     if (monitorIntervalRef.current) {
  //       clearInterval(monitorIntervalRef.current)
  //     }
  //   }
  // }, [currentVoter.token, navigate, dispatch])

  return (
    <SessionManager>
      <Navbar/>
      <div className="main-content">
        <Outlet/>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </SessionManager>
  )
}

export default App
