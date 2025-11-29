import { useNotifications } from '../context/NotificationContext';

export default function Notifications() {
  const { notifications, readNotification } = useNotifications();

  if (notifications.length === 0)
    return <div className="p-4 text-gray-500">نوتیفی جدیدی موجود نیست.</div>;

  return (
    <div className="p-4 space-y-3" dir="rtl">
      {notifications.map((n) => (
        <div
          key={n._id}
          className={`p-4 rounded-xl border shadow-sm cursor-pointer transition
            ${!n.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white'}
          `}
          onClick={() => readNotification(n._id)}>
          <h3 className="font-semibold text-gray-800">{n.title}</h3>
          <p className="text-gray-600 text-sm mt-1">{n.message}</p>

          {/* Action Buttons */}
          {n.meta?.action === 'go_assessment' && (
            <a
              href="/assessment"
              className="text-blue-600 text-sm mt-2 inline-block">
              تکمیل ارزیابی →
            </a>
          )}

          {n.meta?.action === 'go_profile' && (
            <a
              href="/profile"
              className="text-blue-600 text-sm mt-2 inline-block">
              تکمیل پروفایل →
            </a>
          )}

          {n.meta?.action === 'go_photos' && (
            <a
              href="/progress-photos"
              className="text-blue-600 text-sm mt-2 inline-block">
              آپلود عکس →
            </a>
          )}

          {n.meta?.action === 'go_report' && (
            <a
              href="/submit-report"
              className="text-blue-600 text-sm mt-2 inline-block">
              ارسال گزارش →
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
