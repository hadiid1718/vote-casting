import React, { useEffect } from 'react'
import imageE from "../assets/error-page.gif"
import { useNavigate} from "react-router-dom"

const ErrorPage = () => {
 const navigate = useNavigate()
  useEffect(()=> {
    setTimeout(() => {
      navigate(-1)
    }, 6000)
  })
  return (
    <>
    <div className="errorPage">
      <div className="errorPage__container">
        <img src={imageE} alt="page not found" />
        <h1>404</h1>
        <p>This page doesnot exist. You'll be redirect to the previous page shortly.</p>
      </div>
    </div>
    </>
  )
}

export default ErrorPage
