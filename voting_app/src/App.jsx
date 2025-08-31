import { Outlet } from "react-router-dom"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import Navbar from "./components/Navbar"
import { voterActions } from "./store/vote-slice"
import { getStoredAuth } from "./utils/auth"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const dispatch = useDispatch()

  // Load stored authentication on app startup
  useEffect(() => {
    const storedAuth = getStoredAuth()
    if (storedAuth && storedAuth.token) {
      dispatch(voterActions.changeCurrentVoter(storedAuth))
    }
  }, [dispatch])

  return (
    <>
      <Navbar/>
      <Outlet/>
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
    </>
  )
}

export default App
