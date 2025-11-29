// MeasurementCharts.jsx
import React, { useEffect, useState } from 'react';
import api from 'api/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

export default function MeasurementCharts({ userId }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get(`/report/measurements/${userId}`);
      setList(res.data.measurements || []);
    };
    fetchData();
  }, [userId]);

  if (!list.length)
    return (
      <p className="text-gray-500 text-sm">هنوز اندازه‌ای ثبت نشده است.</p>
    );

  const labels = list.map((m) =>
    new Date(m.createdAt).toLocaleDateString('fa-IR')
  );

  const makeDataset = (field, label, color) => ({
    labels,
    datasets: [
      {
        label,
        data: list.map((m) => m[field] || 0),
        borderColor: color,
        backgroundColor: color + '33',
        tension: 0.3,
        fill: true,
      },
    ],
  });

  return (
    <div className="space-y-8 mt-6">
      <h3 className="text-lg font-bold">نمودار پیشرفت اندازه‌ها</h3>

      <div>
        <Line data={makeDataset('waist', 'دور کمر', '#3b82f6')} />
      </div>

      <div>
        <Line data={makeDataset('hips', 'دور باسن', '#ec4899')} />
      </div>

      <div>
        <Line data={makeDataset('chest', 'دور سینه', '#10b981')} />
      </div>

      <div>
        <Line data={makeDataset('bicep', 'دور بازو', '#f59e0b')} />
      </div>
    </div>
  );
}
