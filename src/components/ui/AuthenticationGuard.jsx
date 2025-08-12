import React, { useState, useEffect, createContext, useContext } from 'react';
import { useLocation, Navigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthenticationGuard');
  }
  return context;
};

const AuthenticationGuard = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/registration-stepper'];

  // Protected routes that require authentication
  const protectedRoutes = [
    '/user-dashboard',
    '/training-video-player',
    '/progress-report-submission',
    '/payment-processing',
  ];

  useEffect(() => {
    // Check authentication status on mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Simulate checking authentication from localStorage or API
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');

      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData) => {
    try {
      const token = userData.token || `real-jwt-token-${Date.now()}`; // Replace if token is returned from backend

      // Store real user data
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));

      setIsAuthenticated(true);
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      // Simulate registration API call
      const newUser = {
        id: Date.now().toString(),
        name: userData.fullName,
        email: userData.email,
        membershipType: 'Basic',
        avatar: null,
      };

      const mockToken = 'mock-jwt-token-' + Date.now();

      // Store auth data
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('userData', JSON.stringify(newUser));

      setIsAuthenticated(true);
      setUser(newUser);

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData };
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if current route requires authentication
  const isProtectedRoute = protectedRoutes.includes(location.pathname);
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Redirect logic
  if (isProtectedRoute && !isAuthenticated) {
    // Redirect to login if trying to access protected route without auth
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isPublicRoute && isAuthenticated) {
    // Redirect to dashboard if trying to access public route while authenticated
    const from = location.state?.from?.pathname || '/user-dashboard';
    return <Navigate to={from} replace />;
  }

  // Provide auth context to children
  const authValue = {
    isAuthenticated,
    user,
    login,
    register,
    logout,
    updateUser,
    isLoading,
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export default AuthenticationGuard;
