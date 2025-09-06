import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { voterActions } from "../store/vote-slice";
import { registerVoter } from "../store/thunks";
import { toast } from "react-toastify";

const Register = () => {
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    password: "",
    password2: "",
  });
<<<<<<< HEAD
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'castifyadmin@gmail.com';
=======
>>>>>>> 714dba29d9907957121996e97a1cb5fefba54948
  const [emailValid, setEmailValid] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.vote);
  
  // Clear any previous errors when component mounts
  useEffect(() => {
    dispatch(voterActions.clearError());
  }, [dispatch]);

  const changeInputHandler = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => {
      return { ...prevState, [name]: value };
    });
    
    // Real-time email validation
    if (name === 'email') {
<<<<<<< HEAD
      const isValid = value.toLowerCase() === adminEmail.toLowerCase() || value === '';
=======
      const isValid = value.toLowerCase() === 'iitadmin@gmail.com' || value === '';
>>>>>>> 714dba29d9907957121996e97a1cb5fefba54948
      setEmailValid(isValid);
    }
  };
  const registerUser = async(e) => {
    e.preventDefault();
    
    // Clear any previous errors
    dispatch(voterActions.clearError());
    
    // Validate admin email
<<<<<<< HEAD
    if (userData.email.toLowerCase() !== adminEmail.toLowerCase()) {
      toast.error(`Admin registration is only allowed for the official admin email: ${adminEmail}`);
=======
    if (userData.email.toLowerCase() !== 'iitadmin@gmail.com') {
      toast.error('Admin registration is only allowed for the official admin email: iitadmin@gmail.com');
>>>>>>> 714dba29d9907957121996e97a1cb5fefba54948
      return;
    }
    
    try {
       await dispatch(registerVoter(userData)).unwrap();
       toast.success('Admin registration successful! Please log in.');
       navigate("/login");
    } catch (err) {
      console.error('Registration failed:', err);
      const errorMessage = err.message || err.error || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    }
  }
 
  return (
    <>
      <section className="register">
        <div className="container register__container">
          <h2>Admin Registration</h2>
          
          <form action="" onSubmit={registerUser}>
            
            <input
              type="text"
              name="fullName"
              placeholder="Administrator Full Name *"
              value={userData.fullName}
              onChange={changeInputHandler}
              autoComplete="name"
              autoFocus
              required
            />
            
            <input
              type="email"
              name="email"
<<<<<<< HEAD
              placeholder='Enter official admin email *'
=======
              placeholder="Enter Official Admin Email *"
>>>>>>> 714dba29d9907957121996e97a1cb5fefba54948
              value={userData.email}
              onChange={changeInputHandler}
              autoComplete="email"
              required
              style={{
                borderColor: !emailValid ? '#dc3545' : undefined,
                backgroundColor: !emailValid ? '#fdf2f2' : undefined
              }}
            />
<<<<<<< HEAD
      
=======
>>>>>>> 714dba29d9907957121996e97a1cb5fefba54948
  
            <input
              type="password"
              name="password"
              placeholder="Password *"
              value={userData.password}
              onChange={changeInputHandler}
              autoComplete="new-password"
              required
            />
            
            <input
              type="password"
              name="password2"
              placeholder="Confirm Password *"
              value={userData.password2}
              onChange={changeInputHandler}
              autoComplete="new-password"
              required
            />
            
            <p>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
            
            <button type="submit" className="btn primary" disabled={loading || !emailValid}>
              {loading ? 'Creating Admin Account...' : 'Create Administrator Account'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Register;
