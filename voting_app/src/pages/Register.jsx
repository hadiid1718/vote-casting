import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerVoter } from "../store/thunks";

const Register = () => {
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    password: "",
    password2: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.vote);

  const changeInputHandler = (e) => {
    setUserData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });


  };
  const registerUser = async(e) => {
    e.preventDefault()
    try {
       await dispatch(registerVoter(userData)).unwrap()
       navigate("/")
    } catch (err) {
      console.error('Registration failed:', err)
    }
  }
 
  return (
    <>
      <section className="register">
        <div className="container register__container">
          <h2>Sign Up</h2>
          <form action="" onSubmit={registerUser}>
            {error && <p className="form__error-message">{error}</p>}
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              onChange={changeInputHandler}
              autoComplete="true"
              autoFocus
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={changeInputHandler}
              autoComplete="true"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={changeInputHandler}
              autoComplete="true"
            />
            <input
              type="password"
              name="password2"
              placeholder="Confirm Passowrd"
              onChange={changeInputHandler}
              autoComplete="true"
            />
            <p>
              Already have an account? <Link to="/">Sign in</Link>
            </p>
            <button type="submit" className="btn primary">
              Register
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Register;
