import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { voterActions } from "../store/vote-slice";
import { loginVoter } from "../store/thunks";
import { redirectAfterLogin } from "../utils/authRedirect";
import { toast } from 'react-toastify';

const Login = () => {
  const [loginType, setLoginType] = useState('student'); // 'student' or 'admin'
  const [userData, setUserData] = useState({
    studentId: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector(state => state.vote)
  
  // Clear any previous errors when component mounts
  useEffect(() => {
    dispatch(voterActions.clearError());
  }, [dispatch]);

  const changeInputHandler = (e) => {
    setUserData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const toggleLoginType = (type) => {
    setLoginType(type);
    // Clear form data when switching login type
    setUserData({
      studentId: "",
      email: "",
      password: "",
    });
  };
  const voterLoginHandler = async (e) => {
    e.preventDefault();
    
    // Clear any previous errors
    dispatch(voterActions.clearError());
    
    try {
        const result = await dispatch(loginVoter(userData)).unwrap();
        toast.success(`Welcome ${result.isAdmin ? 'Admin' : 'Student'}! Login successful.`);
        // Redirect based on user role
        redirectAfterLogin(result.isAdmin, navigate);
    } catch (err) {
      console.error('Login failed:', err);
      const errorMessage = err.message || err.error || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
    }
  }
  // console.log(userData)
  return (
    <>
      <section className="register">
        <div className="container register__container">
          <h2>Sign In</h2>
          
          {/* Login Type Toggle */}
          <div className="login-type-toggle" style={{ 
            marginBottom: '2rem', 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '1rem' 
          }}>
            <button
              type="button"
              className={`btn ${loginType === 'student' ? 'primary' : 'secondary'}`}
              onClick={() => toggleLoginType('student')}
              style={{ 
                padding: '0.5rem 1rem',
                fontSize: '0.9rem'
              }}
            >
              Student Login
            </button>
            <button
              type="button"
              className={`btn ${loginType === 'admin' ? 'primary' : 'secondary'}`}
              onClick={() => toggleLoginType('admin')}
              style={{ 
                padding: '0.5rem 1rem',
                fontSize: '0.9rem'
              }}
            >
              Admin Login
            </button>
          </div>

          <form action="" onSubmit={voterLoginHandler}>

            {/* Conditional Input Fields */}
            {loginType === 'student' ? (
              <input
                type="text"
                name="studentId"
                placeholder="Student ID *"
                value={userData.studentId}
                onChange={changeInputHandler}
                autoComplete="username"
                required
              />
            ) : (
              <input
                type="email"
                name="email"
                placeholder="Admin Email *"
                value={userData.email}
                onChange={changeInputHandler}
                autoComplete="email"
                required
              />
            )}
            
            <input
              type="password"
              name="password"
              placeholder="Password *"
              value={userData.password}
              onChange={changeInputHandler}
              autoComplete="current-password"
              required
            />
            
            <div style={{ textAlign: 'center', margin: '1rem 0' }}>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                {loginType === 'student' 
                  ? 'Students must use their Student ID assigned by admin' 
                  : 'Admin login with email address'
                }
              </p>
            </div>
            
            <p>
              Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
            
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? 'Signing In...' : 'Login'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;

