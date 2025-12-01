import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, LogOut, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNotifications } from 'context/NotificationContext';
import NotificationsPanel from 'components/NotificationsPanel';

const ContextualHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const [openNotifications, setOpenNotifications] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('userData'));
    setUser(u);
  }, []);

  /** ---------------- Header Configuration ---------------- */
  const headerConfig = {
    '/login': { back: false, title: '', logo: true, actions: false },
    '/registration-stepper': {
      back: true,
      title: 'خرید دوره تناسب اندام',
      logo: true,
      actions: false,
    },
    '/user-dashboard': {
      back: false,
      title: 'پنل کاربری',
      logo: false,
      actions: true,
    },
    '/training-video-player': {
      back: true,
      title: 'جلسات آموزشی',
      logo: false,
      actions: false,
    },
    '/progress-report-submission': {
      back: true,
      title: 'گزارش پیشرفت',
      logo: false,
      actions: false,
    },
    '/payment-processing': {
      back: true,
      title: 'پرداخت امن',
      logo: true,
      actions: false,
    },
  };

  const config = headerConfig[location.pathname] || {
    back: false,
    title: '',
    logo: true,
    actions: true,
  };

  const handleBack = () => navigate(-1);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border h-16 flex items-center px-4 lg:px-6">
      <div className="flex w-full items-center justify-between" dir="rtl">
        {/* ---------- Right Section (Back + Title) ---------- */}
        <div className="flex items-center gap-3">
          {config.back && (
            <button
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-muted transition lg:hidden">
              <ArrowLeft size={22} className="text-foreground" />
            </button>
          )}

          {config.logo && (
            <span className="font-semibold text-lg text-foreground hidden sm:block">
              پنل دوره
            </span>
          )}

          {config.title && (
            <h1 className="text-lg font-semibold text-foreground">
              {config.title}
            </h1>
          )}
        </div>

        {/* ---------- Center Placeholder (optional) ---------- */}
        <div className="flex-1 hidden lg:block"></div>

        {/* ---------- Left Section (Notifications + Logout) ---------- */}
        <div className="flex items-center gap-3">
          {/* Notif Button */}
          <button
            onClick={() => setOpenNotifications(true)}
            className="relative p-2 rounded-lg hover:bg-muted transition">
            <Bell size={24} className="text-gray-800" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-muted px-3 py-2 rounded-lg hover:bg-muted/70 transition">
            <LogOut size={20} className="text-gray-800" />
            <span className="hidden sm:block text-sm text-gray-800">خروج</span>
          </button>
        </div>
      </div>

      {/* Notifications Panel */}
      {openNotifications && (
        <NotificationsPanel onClose={() => setOpenNotifications(false)} />
      )}
    </header>
  );
};

export default ContextualHeader;
