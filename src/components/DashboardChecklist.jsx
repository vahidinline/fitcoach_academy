import { useNavigate } from 'react-router-dom';

export default function DashboardChecklist({ tasks: completion = {} }) {
  const navigate = useNavigate();

  // وظایف مهم
  const tasks = [
    { key: 'go_assessment', title: 'تکمیل فرم ارزیابی', path: '/user-basic-data?tab=assessment' },
    { key: 'go_profile', title: 'تکمیل پروفایل', path: '/user-basic-data?tab=profile' },
    { key: 'go_measurements', title: 'ثبت سایزها', path: '/progress-report-submission?tab=measurements' },
    { key: 'go_weight', title: 'ثبت وزن اولیه', path: '/progress-report-submission?tab=weight' },
    { key: 'go_photos', title: 'آپلود عکس اولیه', path: '/progress-report-submission?tab=photos' },
  ];

  return (
    <div dir="rtl">
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((t) => (
          <li key={t.key} className="min-h-14">
            <button
              type="button"
              disabled={completion[t.key.replace('go_', '')]}
              onClick={() => navigate(t.path)}
              className={`flex min-h-14 w-full items-center justify-between rounded-2xl border px-4 py-3 text-right text-xs font-semibold transition ${completion[t.key.replace('go_', '')] ? 'cursor-default border-[#1c2c29]/10 bg-[#f3efe7]/45' : 'border-[#df6b52]/30 bg-[#fff8f4] hover:-translate-y-0.5 hover:border-[#df6b52] hover:shadow-md'}`}>
            <span className="text-[#394440]">{t.title}</span>

            {completion[t.key.replace('go_', '')] ? (
              <span className="rounded-full bg-[#638176]/10 px-2 py-1 text-[10px] font-bold text-[#547466]">انجام شد ✓</span>
            ) : (
              <span className="rounded-full bg-[#df6b52]/10 px-2 py-1 text-[10px] font-bold text-[#c45843]">نیاز به انجام</span>
            )}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
