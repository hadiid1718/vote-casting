import React, { useEffect, useState } from 'react'
import {Link , NavLink} from "react-router-dom"
import { useSelector } from 'react-redux'
import { IoIosMoon } from "react-icons/io";
import { IoMdSunny } from "react-icons/io";
import { HiOutlineBars3 } from "react-icons/hi2";
import { AiOutlineClose } from "react-icons/ai";

const Navbar = () => {
  const [ showNav, setShowNav] = useState(window.innerWidth < 768 ? false:true)
  const [ darkTheme, setDarkTheme] = useState(localStorage.getItem('voting-app-theme') || "")
  const { currentVoter } = useSelector(state => state.vote)
  
  // function to open & close menu
  const handleToggling = () => {
    setShowNav(!showNav)
  }
  
  const closeMenu = ()=> {
    if(window.innerWidth < 768) {
      setShowNav(false)
    } else {
      setShowNav(true)
    }
  }
  
  // Handle window resize to properly show/hide menu
  const handleResize = () => {
    if(window.innerWidth >= 768) {
      setShowNav(true)
    } else {
      setShowNav(false)
    }
  }
  
  // Add resize listener
  React.useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // function to toggle/change theme

  const changeThemeHandler = () => {
    if(localStorage.getItem('voting-app-theme')== 'dark') {
      localStorage.setItem('voting-app-theme', '')
    } else {
      
      localStorage.setItem('voting-app-theme', 'dark')
    }
    setDarkTheme(localStorage.getItem('voting-app-theme'))

  }
  useEffect(()=> {
    const theme = localStorage.getItem('voting-app-theme')
    document.body.className = theme
    // Set data-theme attribute for CSS variables
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [darkTheme])
  return (
    <>
       <nav>
        <div className="container nav__container">
        <Link to='/' className='nav_logo'>castify</Link>
        {currentVoter.token && (
          <div className='nav__user-info'>
            <span>Welcome, {currentVoter.isAdmin ? 'Admin' : 'Voter'}</span>
          </div>
        )}
        <div>
          { showNav && 
          <menu>
            {currentVoter.token ? (
              // Show authenticated menu
              <>
                <NavLink to="/blogs" onClick={closeMenu}>Blogs</NavLink>
                <NavLink to="/elections" onClick={closeMenu}>Elections</NavLink>
                <NavLink to="/results" onClick={closeMenu}>Results</NavLink>
                {currentVoter.isAdmin && (
                  <NavLink to="/admin" onClick={closeMenu}>Admin Dashboard</NavLink>
                )}
                <NavLink to="/logout" onClick={closeMenu}>Logout</NavLink>
              </>
            ) : (
              // Show unauthenticated menu
              <>
                <NavLink to="/" onClick={closeMenu}>Blogs</NavLink>
                <NavLink to="/login" onClick={closeMenu}>Login</NavLink>
                <NavLink to="/register" onClick={closeMenu}>Register</NavLink>
              </>
            )}
          </menu>
          }
          <button className='theme__logo-btn' onClick={changeThemeHandler}> 
            { darkTheme ? <IoMdSunny/>:<IoIosMoon/>}
          </button>
          <button className='nav__logo-btn' onClick={handleToggling}>{showNav ? <AiOutlineClose/>: <HiOutlineBars3/>}</button>
        </div>
        </div>

       </nav>
    </>
  )
}

export default Navbar
