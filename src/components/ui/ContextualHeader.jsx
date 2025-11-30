import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import { Bell } from 'lucide-react';
import { useNotifications } from 'context/NotificationContext';
import NotificationsPanel from 'components/NotificationsPanel';

const ContextualHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [accountDetails, setAccountDetails] = useState(false);
  const [user, setUser] = useState('');
  const { unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);

  const getHeaderConfig = () => {
    const path = location.pathname;

    switch (path) {
      case '/login':
        return {
          type: 'minimal',
          showLogo: true,
          showBack: false,
          title: null,
          showActions: false,
        };
      case '/registration-stepper':
        return {
          type: 'registration',
          showLogo: true,
          showBack: true,
          title: 'Create Account',
          showActions: false,
        };
      case '/user-dashboard':
        return {
          type: 'dashboard',
          showLogo: false,
          showBack: false,
          title: 'پنل کاربری',
          showActions: true,
        };
      case '/training-video-player':
        return {
          type: 'immersive',
          showLogo: false,
          showBack: true,
          title: null,
          showActions: false,
        };
      case '/progress-report-submission':
        return {
          type: 'functional',
          showLogo: false,
          showBack: true,
          title: 'گزارش پیشرفت',
          showActions: false,
        };
      case '/payment-processing':
        return {
          type: 'secure',
          showLogo: true,
          showBack: true,
          title: 'پرداخت امن',
          showActions: false,
        };
      default:
        return {
          type: 'default',
          showLogo: true,
          showBack: false,
          title: null,
          showActions: true,
        };
    }
  };

  const config = getHeaderConfig();

  const handleBack = () => {
    navigate(-1);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const toggleAccount = () => {
    setAccountDetails(!accountDetails);
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('userData')));
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-card border-b border-border z-200 lg:left-64">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section */}
        <div className="relative">
          {/* Bell Icon */}
          <button
            onClick={() => setOpen(true)}
            className="relative p-1 focus:outline-none">
            <Bell size={26} className="text-gray-800" />

            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Panel */}
          {open && <NotificationsPanel onClose={() => setOpen(false)} />}
        </div>
        <div className="flex items-center space-x-4">
          {config.showBack && (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 rounded-lg hover:bg-muted animate-spring lg:hidden">
              <Icon name="ArrowLeft" size={20} className="text-foreground" />
            </button>
          )}

          {config.showLogo && (
            <div className="flex items-center space-x-3">
              <span className="text-lg font-semibold text-foreground hidden sm:block">
                پنل دوره
              </span>
            </div>
          )}

          {config.title && (
            <h1 className="text-lg font-semibold text-foreground">
              {config.title}
            </h1>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2"></div>
      </div>

      {/* Click outside to close notifications */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-200"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </header>
  );
};

export default ContextualHeader;
