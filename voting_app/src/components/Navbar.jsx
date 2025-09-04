import React, { useEffect, useState } from 'react'
import {Link , NavLink} from "react-router-dom"
import { useSelector } from 'react-redux'
import { IoIosMoon } from "react-icons/io";
import { IoMdSunny } from "react-icons/io";
import { HiOutlineBars3 } from "react-icons/hi2";
import { AiOutlineClose } from "react-icons/ai";

const Navbar = () => {
  const [ showNav, setShowNav] = useState(window.innerWidth < 600 ? false:true)
  const [ darkTheme, setDarkTheme] = useState(localStorage.getItem('voting-app-theme') || "")
  const { currentVoter } = useSelector(state => state.vote)
  // function to open & close menu
  const handleToggling = () => {
    setShowNav(!showNav)
  }
  const closeMenu = ()=> {
    if(window.innerWidth < 600) {
      setShowNav(false)
    } else {
      setShowNav(true)
    }
  }

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
    document.body.className = localStorage.getItem('voting-app-theme')
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
