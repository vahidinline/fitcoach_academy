import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import gsap from 'gsap';

export default function NotificationsPanel({ onClose }) {
  const panelRef = useRef(null);
  const overlayRef = useRef(null);
  const { notifications, readNotification } = useNotifications();

  useEffect(() => {
    // Animate opening
    gsap.fromTo(
      panelRef.current,
      { x: 300 },
      { x: 0, duration: 0.4, ease: 'power3.out' }
    );

    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    );
  }, []);

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"></div>

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed top-0 right-0 w-80 h-full bg-white shadow-xl z-50 p-4 overflow-y-auto"
        dir="rtl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">نوتیفیکیشن‌ها</h2>

          <button onClick={onClose}>
            <X size={24} className="text-gray-600 hover:text-black" />
          </button>
        </div>

        {notifications.length === 0 && (
          <p className="text-gray-500 text-sm">نوتیف جدیدی وجود ندارد.</p>
        )}

        {/* List */}
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => readNotification(n._id)}
              className={`p-3 rounded-xl border cursor-pointer transition ${
                !n.isRead ? 'bg-blue-50 border-blue-300' : 'bg-gray-50'
              }`}>
              <h4 className="font-bold text-gray-800 text-sm">{n.title}</h4>
              <p className="text-gray-600 text-xs mt-1">{n.message}</p>

              {/* Action Button */}
              {n.meta?.action && (
                <a
                  href={metaToLink(n.meta.action)}
                  className="text-blue-600 text-xs mt-2 inline-block">
                  انجام →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// تبدیل اکشن به لینک صفحه
function metaToLink(action) {
  switch (action) {
    case 'go_assessment':
      return '/user-basic-data';
    case 'go_profile':
      return '/user-basic-data';
    case 'go_photos':
      return '/progress-report-submission';
    case 'go_report':
      return '/sprogress-report-submission';
    case 'go_measurements':
      return '/progress-report-submission';
    default:
      return '/';
  }
}
