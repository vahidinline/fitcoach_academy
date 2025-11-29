// MeasurementInsights.jsx
export default function MeasurementInsights({ data }) {
  if (data.length < 2) return null;

  const first = data[0];
  const last = data[data.length - 1];

  const metrics = [
    { key: 'waist', label: 'دور کمر' },
    { key: 'hips', label: 'باسن' },
    { key: 'chest', label: 'سینه' },
    { key: 'bicep', label: 'بازو' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {metrics.map((m) => {
        const f = first[m.key];
        const l = last[m.key];
        if (!f || !l) return null;

        const diff = f - l;

        return (
          <div key={m.key} className="p-4 bg-white shadow rounded-xl">
            <p className="text-sm text-gray-500">{m.label}</p>
            <p className="text-xl font-bold text-green-600">
              {diff > 0 ? `-${diff}` : 0} cm
            </p>
          </div>
        );
      })}
    </div>
  );
}
