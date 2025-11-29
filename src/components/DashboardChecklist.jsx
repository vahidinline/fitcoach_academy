import { useNotifications } from '../context/NotificationContext';

export default function DashboardChecklist() {
  const { notifications } = useNotifications();

  // وظایف مهم
  const tasks = [
    { key: 'go_assessment', title: 'تکمیل فرم ارزیابی' },
    { key: 'go_profile', title: 'تکمیل پروفایل' },
    { key: 'go_measurements', title: 'ثبت سایزها' },
    { key: 'go_weight', title: 'ثبت وزن اولیه' },
    { key: 'go_photos', title: 'آپلود عکس اولیه' },
  ];

  const needed = notifications.filter((n) => !n.isRead && n.meta?.action);

  return (
    <div dir="rtl" className="p-4 bg-white rounded-xl border shadow">
      <h3 className="font-semibold text-gray-800 mb-3">
        کارهای لازم برای شروع
      </h3>

      <ul className="space-y-2">
        {tasks.map((t) => (
          <li key={t.key} className="flex items-center justify-between">
            <span>{t.title}</span>

            {needed.some((n) => n.meta.action === t.key) ? (
              <span className="text-red-500 text-sm">نیاز به انجام</span>
            ) : (
              <span className="text-green-600 text-sm">انجام شد ✓</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
