// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../components/ui/AuthenticationGuard';
// import Icon from '../../components/AppIcon';
// import LocationDetector from './components/LocationDetector';
// import LanguageToggle from './components/LanguageToggle';
// import IranianAuthForm from './components/IranianAuthForm';
// import InternationalAuthForm from './components/InternationalAuthForm';
// import TrustSignals from './components/TrustSignals';
// import AuthFooter from './components/AuthFooter';
// import { t } from '../../utils/translations';

// const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [userLocation, setUserLocation] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [currentLanguage, setCurrentLanguage] = useState('fa');

//   useEffect(() => {
//     // Listen for language changes
//     const handleLanguageChange = (event) => {
//       setCurrentLanguage(event.detail);
//     };

//     window.addEventListener('languageChanged', handleLanguageChange);

//     // Check initial language - default to Persian
//     const savedLanguage = localStorage.getItem('selectedLanguage') || 'fa';
//     setCurrentLanguage(savedLanguage);

//     return () => {
//       window.removeEventListener('languageChanged', handleLanguageChange);
//     };
//   }, []);

//   const handleLocationDetected = (location) => {
//     setUserLocation(location);
//   };

//   const handleAuthSubmit = async (authData) => {
//     setIsLoading(true);
//     setError('');

//     try {
//       const response = await fetch(
//         'http://localhost:8080/academyAuth/register',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             ...authData,
//             location: userLocation,
//           }),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || 'احراز هویت ناموفق بود');
//       }

//       const result = await response.json();

//       // Pass the result to your auth context
//       const loginResult = await login(result);

//       if (loginResult.success) {
//         navigate('/user-dashboard');
//       } else {
//         setError(loginResult.error || 'احراز هویت ناموفق بود');
//       }
//     } catch (err) {
//       setError(err.message || 'احراز هویت ناموفق بود. لطفاً دوباره تلاش کنید.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // mock auth submit
//   // const handleAuthSubmit = async (authData) => {
//   //   console.log('authData', authData);
//   //   setIsLoading(true);
//   //   setError('');

//   //   try {
//   //     // Simulate authentication process
//   //     await new Promise((resolve) => setTimeout(resolve, 2000));

//   //     // Mock credentials for testing
//   //     const mockCredentials = {
//   //       iranian: {
//   //         phoneNumber: '+989123456789',
//   //         method: 'sms',
//   //       },
//   //       international: {
//   //         email: 'demo@fitcoach.com',
//   //         phoneNumber: '+1234567890',
//   //         method: 'email',
//   //       },
//   //     };

//   //     const expectedCreds =
//   //       userLocation === 'iran'
//   //         ? mockCredentials.iranian
//   //         : mockCredentials.international;

//   //     // Validate credentials
//   //     let isValid = false;
//   //     if (userLocation === 'iran') {
//   //       isValid = authData.phoneNumber === expectedCreds.phoneNumber;
//   //     } else {
//   //       isValid =
//   //         authData.email === expectedCreds.email ||
//   //         authData.phoneNumber === expectedCreds.phoneNumber;
//   //     }

//   //     if (!isValid) {
//   //       throw new Error(
//   //         'اطلاعات ورود اشتباه است. لطفاً از اطلاعات نمونه ارائه شده استفاده کنید.'
//   //       );
//   //     }

//   //     // Simulate successful login
//   //     const result = await login({
//   //       email: authData.email || 'user@fitcoach.com',
//   //       method: authData.method,
//   //       location: userLocation,
//   //     });

//   //     if (result.success) {
//   //       navigate('/user-dashboard');
//   //     } else {
//   //       setError(result.error || 'احراز هویت ناموفق بود');
//   //     }
//   //   } catch (err) {
//   //     setError(err.message || 'احراز هویت ناموفق بود. لطفاً دوباره تلاش کنید.');
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   return (
//     <div className="min-h-screen bg-background font-vazir">
//       {/* Header */}
//       <header className="flex items-center justify-between p-4 border-b border-border bg-card">
//         <div className="flex items-center space-x-3 rtl:space-x-reverse">
//           <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
//             <Icon
//               name="Dumbbell"
//               size={20}
//               className="text-primary-foreground"
//             />
//           </div>
//           <span className="text-lg font-semibold text-foreground">
//             {t('login.appName')}
//           </span>
//         </div>
//         <LanguageToggle />
//       </header>

//       {/* Main Content */}
//       <main className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
//         <div className="w-full max-w-md">
//           {/* App Logo and Welcome */}
//           <div className="text-center mb-8">
//             <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-elevation-2">
//               <Icon
//                 name="Dumbbell"
//                 size={32}
//                 className="text-primary-foreground"
//               />
//             </div>
//             <h1 className="text-2xl font-bold text-foreground mb-2">
//               {t('login.welcome')}
//             </h1>
//             <p className="text-muted-foreground">{t('login.signInMessage')}</p>
//           </div>

//           {/* Authentication Form */}
//           <div className="bg-card rounded-lg shadow-elevation-1 p-6 border border-border">
//             {/* {!userLocation ? (
//               <LocationDetector onLocationDetected={handleLocationDetected} />
//             ) : userLocation === 'iran' ? (
//               <IranianAuthForm
//                 onSubmit={handleAuthSubmit}
//                 isLoading={isLoading}
//                 error={error}
//               />
//             ) : ( */}
//             <InternationalAuthForm
//               onSubmit={handleAuthSubmit}
//               isLoading={isLoading}
//               error={error}
//             />
//             {/* )} */}

//             {/* Trust Signals */}
//             {userLocation && <TrustSignals userLocation={userLocation} />}

//             {/* Footer Links */}
//             <AuthFooter />
//           </div>

//           {/* Demo Credentials Info */}
//           {userLocation && (
//             <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
//               <div className="flex items-start space-x-2 rtl:space-x-reverse">
//                 <Icon name="Info" size={16} className="text-primary mt-0.5" />
//                 <div className="text-sm">
//                   <p className="font-medium text-foreground mb-1">
//                     {t('login.demoCredentials')}
//                   </p>
//                   {userLocation === 'iran' ? (
//                     <p className="text-muted-foreground">{t('login.phone')}</p>
//                   ) : (
//                     <div className="text-muted-foreground">
//                       <p>{t('login.email')}</p>
//                       <p>{t('login.phoneInternational')}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>

//       {/* Background Pattern */}
//       <div className="fixed inset-0 -z-10 opacity-5">
//         <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20"></div>
//         <div
//           className="absolute inset-0"
//           style={{
//             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
//           }}></div>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/ui/AuthenticationGuard';
import Icon from '../../components/AppIcon';
import LocationDetector from './components/LocationDetector';
import LanguageToggle from './components/LanguageToggle';
import IranianAuthForm from './components/IranianAuthForm';
import InternationalAuthForm from './components/InternationalAuthForm';
import TrustSignals from './components/TrustSignals';
import AuthFooter from './components/AuthFooter';
import { t } from '../../utils/translations';

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
        'https://aziserver.azurewebsites.net/academyAuth/verify-otp',
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
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon
              name="Dumbbell"
              size={20}
              className="text-primary-foreground"
            />
          </div>
          <span className="text-lg font-semibold text-foreground">
            {t('login.appName')}
          </span>
        </div>
        {/* <LanguageToggle /> */}
      </header>

      {/* Main */}
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-md">
          {!showOtpInput ? (
            // !userLocation ? (
            //   <LocationDetector onLocationDetected={handleLocationDetected} />
            // ) : userLocation === 'iran' ? (
            //   <IranianAuthForm
            //     onSubmit={handleAuthSubmit}
            //     isLoading={isLoading}
            //     error={error}
            //   />
            // ) : (
            <InternationalAuthForm
              onSubmit={handleAuthSubmit}
              isLoading={isLoading}
              error={error}
            />
          ) : (
            //)
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

          {/* {userLocation && <TrustSignals userLocation={userLocation} />} */}
          {/* <AuthFooter /> */}
        </div>
      </main>
    </div>
  );
};

export default Login;
