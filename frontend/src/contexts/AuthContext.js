import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/axios'; // Import the configured axios instance

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkAuth(token);
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async (token) => {
    try {
      const response = await api.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      console.log('Attempting login with:', { email }); // Debug log
      
      const response = await api.post('/api/auth/login', {
        email,
        password
      });
      
      console.log('Login response:', response.data); // Debug log
      
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      
      // No need to set default header here if using the `api` instance with interceptors
      
      return userData;
    } catch (err) {
      console.error('Login error:', err); // Debug log
      let errorMessage = 'Login failed';
      
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (err.response.status === 400) {
          errorMessage = err.response.data.message || 'Invalid login data';
        } else {
          errorMessage = err.response.data.message || 'Login failed';
        }
      } else if (err.request) {
        errorMessage = 'No response from server. Please check your internet connection';
      } else {
        errorMessage = err.message || 'An unexpected error occurred';
      }
      
      throw new Error(errorMessage);
    }
  };

  const register = async (name, email, password) => {
    try {
      setError(null);
      const response = await api.post('/api/auth/register', {
        name,
        email,
        password
      });
      
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      
      // No need to set default header here if using the `api` instance with interceptors

      return userData;
    } catch (err) {
      let errorMessage = 'Registration failed';
      
      if (err.response) {
        if (err.response.status === 409) {
          errorMessage = 'Email already exists';
        } else if (err.response.status === 400) {
          errorMessage = err.response.data.message || 'Invalid registration data';
        } else {
          errorMessage = err.response.data.message || 'Registration failed';
        }
      } else if (err.request) {
        errorMessage = 'No response from server. Please check your internet connection';
      }
      
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    // No need to delete default header here if using the `api` instance with interceptors
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 