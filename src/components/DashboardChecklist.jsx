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
    <div dir="rtl">
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((t) => (
          <li key={t.key} className="flex min-h-14 items-center justify-between rounded-2xl border border-[#1c2c29]/10 bg-[#f3efe7]/45 px-4 py-3 text-xs font-semibold">
            <span className="text-[#394440]">{t.title}</span>

            {needed.some((n) => n.meta.action === t.key) ? (
              <span className="rounded-full bg-[#df6b52]/10 px-2 py-1 text-[10px] font-bold text-[#c45843]">نیاز به انجام</span>
            ) : (
              <span className="rounded-full bg-[#638176]/10 px-2 py-1 text-[10px] font-bold text-[#547466]">انجام شد ✓</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
