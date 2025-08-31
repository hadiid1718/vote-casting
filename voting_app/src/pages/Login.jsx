import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { voterActions } from "../store/vote-slice";
import { loginVoter } from "../store/thunks";
import { redirectAfterLogin } from "../utils/authRedirect";
import { toast } from 'react-toastify';

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector(state => state.vote)

  const changeInputHandler = (e) => {
    setUserData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });

  };
  const voterLoginHandler = async (e) => {
    e.preventDefault()
    try {
        const result = await dispatch(loginVoter(userData)).unwrap()
        toast.success('Login successful!');
        // Redirect based on user role
        redirectAfterLogin(result.isAdmin, navigate)
    } catch (err) {
      console.error('Login failed:', err)
      toast.error(`Login failed: ${err.message || 'Please check your credentials'}`);
    }
  }
  // console.log(userData)
  return (
    <>
      <section className="register">
        <div className="container register__container">
          <h2>Sign In</h2>
          <form action="" onSubmit={voterLoginHandler}>
            { error && <p className="form__error-message">{error}</p>}

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
            <p>
              Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
            <button type="submit" className="btn primary">
              Login
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;

