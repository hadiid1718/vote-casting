import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllStudents } from '../store/thunks';

/**
 * Custom hook to automatically fetch admin data when an admin user is logged in
 */
export const useAdminData = () => {
  const dispatch = useDispatch();
  const { currentVoter, students } = useSelector(state => state.vote);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Only fetch data for admin users who are authenticated
    // and only if we haven't already attempted to fetch
    if (currentVoter.isAdmin && currentVoter.token && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      dispatch(fetchAllStudents());
    }
    
    // Reset the flag when user logs out
    if (!currentVoter.token) {
      hasFetchedRef.current = false;
    }
  }, [currentVoter.isAdmin, currentVoter.token, dispatch]);

  return {
    isAdmin: currentVoter.isAdmin,
    isAuthenticated: !!currentVoter.token,
    studentsLoaded: students.length > 0
  };
};
