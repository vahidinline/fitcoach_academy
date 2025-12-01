import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import { useNotifications } from 'context/NotificationContext';
import { Bell } from 'lucide-react';
import api from 'api/api';

const BottomTabNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('');
  const { unreadCount } = useNotifications();
  const userId = JSON.parse(localStorage.getItem('userData') || '{}')?.id;
  const [productType, setProductType] = useState('');
  const getUserProduct = async () => {
    try {
      const res = await api.get(`/api/subscription/active/${userId}`);
      console.log('user profile in sidebar', res.data.subscription.productType);
      if (res) {
        setProductType(res.data.subscription.productType);
      } else setProductType('');
    } catch {
      setProductType('');
    }
  };

  useEffect(() => {
    getUserProduct();
  }, []);
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
      productType: 'academy',
    },
    {
      id: 'basic-data',
      label: 'اطلاعات اولیه',
      path: '/user-basic-data',
      icon: 'UserRoundPen',
      badge: null,
      status: 'active',
    },
    {
      id: 'progress',
      label: 'گزارش',
      path: '/progress-report-submission',
      icon: 'TrendingUp',
      badge: null,
      status: 'activate',
    },
    {
      id: 'payment',
      label: 'سوابق پرداخت',
      path: '/payment-history',
      icon: 'CreditCard',
      badge: null,
      status: 'active',
      productType: 'academy',
    },
    {
      id: 'certificate',
      label: 'سرتیفیکیت',
      path: '/request-for-certificate',
      icon: 'ShieldCheck',
      badge: null,
      status: 'deActivated',
    },
    {
      id: 'quiz',
      label: ' آزمون ',
      path: '/quiz',
      icon: 'NotebookPen',
      badge: null,
    },
  ];

  const filteredNavigationItems = navigationItems.filter((item) => {
    // اگر آیتم productType نداشت = همیشه نمایش داده شود
    if (!item.productType) return true;

    // اگر آیتم productType داشت = فقط وقتی نمایش داده شود که با محصول کاربر یکی باشد
    return item.productType === productType;
  });

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
          {filteredNavigationItems.map((item) => {
            return (
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
            );
          })}
        </div>
      </div>

      {/* Desktop Sidebar Navigation */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-100">
        <div className="flex flex-col h-full">
          {/* Logo Section */}

          {/* Navigation Items */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {filteredNavigationItems.map((item) => (
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
