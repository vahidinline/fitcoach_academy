import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, ChevronRight, LogOut } from 'lucide-react';
import { useNotifications } from 'context/NotificationContext';
import NotificationsPanel from 'components/NotificationsPanel';

const titles = [
  ['/user-dashboard', 'خانه'],
  ['/progress-report-submission', 'گزارش و مسیر پیشرفت'],
  ['/training-video-player', 'آموزش‌ها'],
  ['/user-basic-data', 'پروفایل من'],
  ['/diet-plan', 'رژیم شخصی من'],
];

const ContextualHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const [openNotifications, setOpenNotifications] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem('userData') || 'null'));
    } catch {
      setUser(null);
    }
  }, []);

  const title = titles.find(([path]) => location.pathname.startsWith(path))?.[1] || '';
  const isDashboard = location.pathname === '/user-dashboard';
  const showBack = !isDashboard && !['/', '/login', '/registration-stepper'].includes(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    navigate('/', { replace: true });
  };

  return (
    <>
      <header
        dir="rtl"
        className="fixed inset-x-0 top-0 z-50 h-[4.5rem] border-b border-[#1c2c29]/10 bg-[#f3efe7]/85 px-4 backdrop-blur-xl sm:px-6 lg:pr-[19rem]">
        <div className="mx-auto flex h-full max-w-[1320px] items-center justify-between lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            {showBack && (
              <button
                type="button"
                onClick={() => navigate(-1)}
                aria-label="بازگشت"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#1c2c29]/10 bg-white/60 text-[#1c2c29] transition hover:bg-white">
                <ChevronRight size={20} />
              </button>
            )}
            <div className="min-w-0">
              <p className="academy-kicker hidden sm:block">SHAPE UP ACADEMY</p>
              <h1 className="truncate text-base font-black text-[#18211f] sm:text-lg">
                {isDashboard ? `سلام ${user?.name || ''}` : title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpenNotifications(true)}
              aria-label="اعلان‌ها"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#1c2c29]/10 bg-white/60 text-[#1c2c29] transition hover:bg-white">
              <Bell size={19} />
              {unreadCount > 0 && (
                <span className="absolute -left-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#df6b52] px-1 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? '۹+' : unreadCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="hidden h-10 items-center gap-2 rounded-xl border border-[#1c2c29]/10 bg-white/60 px-3 text-xs font-bold text-[#68716d] transition hover:bg-white hover:text-[#18211f] sm:flex">
              <LogOut size={17} />
              خروج
            </button>
          </div>
        </div>
      </header>

      {openNotifications && (
        <NotificationsPanel onClose={() => setOpenNotifications(false)} />
      )}
    </>
  );
};

export default ContextualHeader;
