import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/ui/AuthenticationGuard';
import Icon from '../../components/AppIcon';
import InternationalAuthForm from './components/InternationalAuthForm';
import { t } from '../../utils/translations';
import Login from './Login';

const LoginIndex = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('fa');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [pendingUser, setPendingUser] = useState(null); // store data for OTP verify

  useEffect(() => {
    const handleLanguageChange = (event) => {
      setCurrentLanguage(event.detail);
    };
    window.addEventListener('languageChanged', handleLanguageChange);

    const savedLanguage = localStorage.getItem('selectedLanguage') || 'fa';
    setCurrentLanguage(savedLanguage);

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  const handleLocationDetected = (location) => setUserLocation(location);

  const handleAuthSubmit = async (authData) => {
    setIsLoading(true);
    setError('');

    try {
      // Send request to backend to initiate OTP
      const response = await fetch(
        'https://aziserver.azurewebsites.net/academyAuth/auth',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...authData, location: userLocation }),
        }
      );

      const result = await response.json();
      if (result.status !== 'ok') {
        throw new Error(result.error || result.message || 'خطا در ارسال OTP');
      }

      // Save pending user data for OTP verification
      setPendingUser({ ...authData });
      setShowOtpInput(true); // show OTP input form
    } catch (err) {
      setError(err.message || 'خطایی رخ داد');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(
        'http://localhost:8080/academyAuth/verify-otp',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: pendingUser.email,
            otp,
          }),
        }
      );

      const result = await response.json();
      console.log('result raw', result);
      if (result.status !== 'ok')
        throw new Error(result.error || 'کد تایید نامعتبر است');

      // If OTP is valid, log user in and redirect
      const loginResult = await login(result.userData);
      console.log('loginResult', loginResult);
      if (loginResult.success) {
        navigate('/user-dashboard');
      } else {
        setError(loginResult.error || 'احراز هویت ناموفق بود');
      }
    } catch (err) {
      setError(err.message || 'کد تایید نامعتبر است');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background font-vazir">
      <Login />
    </div>
  );
};

export default LoginIndex;
