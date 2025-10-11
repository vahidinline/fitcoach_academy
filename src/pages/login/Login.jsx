import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/ui/AuthenticationGuard';
import Icon from '../../components/AppIcon';
import InternationalAuthForm from './components/InternationalAuthForm';
import { t } from '../../utils/translations';
import IranianAuthForm from './components/IranianAuthForm';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('fa');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [pendingUser, setPendingUser] = useState(null); // store data for OTP verify
  console.log('pendingUser', pendingUser);
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
    console.log('authData', authData);
    setIsLoading(true);
    setError('');

    try {
      // Send request to backend to initiate OTP
      const response = await fetch(
        'https://aziserver.azurewebsites.net/academyAuth/login',
        //'http://localhost:8080/academyAuth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...authData, location: userLocation }),
        }
      );

      const result = await response.json();
      console.log('result', result);
      if (result.status !== 'ok') {
        throw new Error(result.error || result.message || 'خطا در ارسال OTP');
      }
      if (result.code === 404) {
        // throw new Error('کاربری با این ایمیل یافت نشد');
        setError('کاربری با این ایمیل یافت نشد');
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
        'https://aziserver.azurewebsites.net/academyAuth/verify-otp',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: pendingUser.email,
            phone: pendingUser.phoneNumber,
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
      {/* Header */}

      {/* Main */}
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-md">
          {!showOtpInput ? (
            <>
              {/* name of each tab group should be unique */}
              <div className="tabs tabs-border">
                <input
                  type="radio"
                  name="my_tabs_2"
                  className="tab"
                  aria-label="ورود با ایمیل"
                />
                <div className="tab-content border-base-300 bg-base-100 p-10">
                  {' '}
                  <InternationalAuthForm
                    onSubmit={handleAuthSubmit}
                    isLoading={isLoading}
                    error={error}
                  />
                </div>

                <input
                  type="radio"
                  name="my_tabs_2"
                  className="tab"
                  aria-label="ورود با موبایل"
                  defaultChecked
                />
                <div className="tab-content border-base-300 bg-base-100 p-10">
                  {' '}
                  <IranianAuthForm
                    onSubmit={handleAuthSubmit}
                    isLoading={isLoading}
                    error={error}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="bg-card rounded-lg shadow-elevation-1 p-6 border border-border">
              <h2 className="text-xl font-bold mb-4">کد تایید را وارد کنید</h2>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                placeholder="کد تایید"
              />
              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
              <button
                onClick={handleOtpSubmit}
                disabled={isLoading}
                className="w-full bg-primary text-white py-2 rounded">
                {isLoading ? 'در حال تایید...' : 'تایید'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Login;
