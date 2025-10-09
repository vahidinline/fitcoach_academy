import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const BottomTabNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('');

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'پنل کاربری',
      path: '/user-dashboard',
      icon: 'Home',
      badge: null,
      status: 'active',
    },
    {
      id: 'training',
      label: 'آموزش ها',
      path: '/training-video-player',
      icon: 'Play',
      badge: null,
      status: 'active',
    },
    {
      id: 'basic-data',
      label: 'اطلاعات اولیه',
      path: '/user-basic-data',
      icon: 'Info',
      badge: null,
      status: 'active',
    },
    // {
    //   id: 'progress',
    //   label: 'گزارش',
    //   path: '/progress-report-submission',
    //   icon: 'TrendingUp',
    //   badge: null,
    //   status: 'deActivated',
    // },
    // {
    //   id: 'payment',
    //   label: 'Payment',
    //   path: '/payment-processing',
    //   icon: 'CreditCard',
    //   badge: null,
    // },
  ];

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    navigate('/');
    console.log('handle logout');
  };

  useEffect(() => {
    const currentPath = location.pathname;
    const activeItem = navigationItems.find(
      (item) => item.path === currentPath
    );
    if (activeItem) {
      setActiveTab(activeItem.id);
    }
  }, [location.pathname]);

  const handleTabClick = (item) => {
    setActiveTab(item.id);
    navigate(item.path);
  };

  // Hide bottom navigation on login and registration pages
  if (
    location.pathname === '/login' ||
    location.pathname === '/registration-stepper'
  ) {
    return null;
  }

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className=" lg:hidden fixed bottom-0  right-0 left-0 bg-card border-t border-border z-100 pb-safe">
        <div className="flex items-center justify-around px-4 py-2">
          {navigationItems.map((item) => (
            <button
              disabled={item.status === 'deActivated'}
              key={item.id}
              onClick={() => handleTabClick(item)}
              className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 animate-spring ${
                activeTab === item.id
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              style={{ minHeight: '48px' }}>
              <div className="relative mb-1">
                <Icon
                  name={item.icon}
                  size={20}
                  className={
                    activeTab === item.id ? 'text-primary' : 'text-current'
                  }
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium truncate max-w-full">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Sidebar Navigation */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-100">
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              {/* <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon
                  name="Dumbbell"
                  size={20}
                  className="text-primary-foreground"
                />
              </div> */}
              <span className="text-xl font-semibold text-foreground">
                آذی‌شفیعی
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left animate-spring ${
                    activeTab === item.id
                      ? 'bg-primary text-primary-foreground shadow-elevation-1'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}>
                  <div className="relative">
                    <Icon name={item.icon} size={20} className="text-current" />
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* User Profile Section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon
                  name="logout"
                  size={16}
                  className="text-secondary-foreground"
                />
              </div>
              <button
                className="flex-1 min-w-0"
                onClick={() => {
                  handleLogout();
                }}>
                خروج
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Spacer for Mobile */}
      <div className="lg:hidden h-16" />
    </>
  );
};

export default BottomTabNavigation;
