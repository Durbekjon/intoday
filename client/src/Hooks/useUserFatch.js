import { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../axiosIn';

const useUserFatch = () => {
  const [user, setUser] = useState(null); // User data
  const [userLoading, setUserLoading] = useState(true); // Loading state
  const [userError, setUserError] = useState(null); // Error state

  useEffect(() => {
    const fetchUser = async () => {
      setUserLoading(true); // Start loading

      const token = localStorage.getItem('token'); // Get token from localStorage
      if (!token) {
        setUserError(new Error('No token found')); // Handle missing token
        setUserLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get('/auth');

        setUser(response.data); // Set the user data
      } catch (error) {
        setUserError(error); // Set error if request fails
      } finally {
        setUserLoading(false); // Stop loading
      }
    };

    fetchUser(); // Fetch user on component mount
  }, []); // Only run once when the component mounts

  return { user, userLoading, userError };
};

export default useUserFatch;
