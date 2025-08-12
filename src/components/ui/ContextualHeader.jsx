import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const ContextualHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState('');

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

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('userData')));
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-card border-b border-border z-200 lg:left-64">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section */}
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
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon
                  name="Dumbbell"
                  size={20}
                  className="text-primary-foreground"
                />
              </div>
              <span className="text-lg font-semibold text-foreground hidden sm:block">
                آذی‌شفیعی
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
        <div className="flex items-center space-x-2">
          {config.showActions && (
            <>
              {/* Search Button */}
              {/* <button className="p-2 rounded-lg hover:bg-muted animate-spring hidden sm:flex">
                <Icon
                  name="Search"
                  size={20}
                  className="text-muted-foreground"
                />
              </button> */}

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={toggleNotifications}
                  className="p-2 rounded-lg hover:bg-muted animate-spring relative">
                  <Icon
                    name="Bell"
                    size={20}
                    className="text-muted-foreground"
                  />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-12 w-80 bg-popover border border-border rounded-lg shadow-elevation-2 z-300">
                    <div className="p-4 border-b border-border">
                      <h3 className="font-semibold text-popover-foreground">
                        اعلان‌ها
                      </h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="p-4 border-b border-border hover:bg-muted animate-spring">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-popover-foreground"></p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Your coach has uploaded a new training session
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              2 hours ago
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border-b border-border hover:bg-muted animate-spring">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-muted rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-popover-foreground">
                              Progress report reviewed
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Your coach has provided feedback on your latest
                              submission
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              1 day ago
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 border-t border-border">
                      <button className="text-sm text-primary hover:text-primary/80 animate-spring">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar */}
              <div className="flex items-center space-x-2 ml-2">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <Icon
                    name="User"
                    size={16}
                    className="text-secondary-foreground"
                  />
                </div>
                <span className="text-sm font-medium text-foreground hidden md:block">
                  {user.name}
                </span>
              </div>
            </>
          )}

          {/* Secure Payment Indicator */}
          {config.type === 'secure' && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-success/10 rounded-full">
              <Icon name="Shield" size={16} className="text-success" />
              <span className="text-xs font-medium text-success">Secure</span>
            </div>
          )}
        </div>
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
