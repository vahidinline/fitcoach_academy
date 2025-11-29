export default function StepFinish({ data = {}, isEditing, submit }) {
  const safe = {
    age: data.age || '—',
    height: data.height || '—',
    gender: data.gender || '—',
    mainGoal: data.mainGoal || '—',
    activityLevel: data.activityLevel || '—',
    trainingDays: data.trainingDays || '—',
  };

  return (
    <div className="space-y-4 text-center">
      <h2 className="text-xl font-bold text-green-600">
        همه‌چیز آماده است! 🎉
      </h2>

      <div className="p-4 bg-gray-100 rounded-xl text-right text-sm space-y-2">
        <p>سن: {safe.age}</p>
        <p>قد: {safe.height}</p>
        <p>جنسیت: {safe.gender}</p>
        <p>هدف: {safe.mainGoal}</p>
        <p>سطح فعالیت: {safe.activityLevel}</p>
        <p>روزهای تمرین: {safe.trainingDays}</p>
      </div>

      <button onClick={submit} className="btn-primary mt-5">
        {isEditing ? 'ذخیره تغییرات' : 'ثبت نهایی'}
      </button>
    </div>
  );
}
