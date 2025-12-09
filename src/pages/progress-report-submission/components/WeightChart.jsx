// // WeightChart.jsx
// import React, { useEffect, useState } from 'react';
// import api from 'api/api';
// import { Line } from 'react-chartjs-2';
// import 'chart.js/auto';

// export default function WeightChart({ userId }) {
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     load();
//   }, []);

//   const load = async () => {
//     const res = await api.get(`/report/weight/${userId}`);
//     setData(res.data.data);
//   };

//   if (!data) return <p>هیچ داده‌ای موجود نیست</p>;

//   return (
//     <div className="p-4 bg-white rounded-xl shadow">
//       <h3 className="font-bold mb-4">نمودار پیشرفت وزن</h3>

//       <Line
//         data={{
//           labels: data.weightEntries.map((e) =>
//             new Date(e.date).toLocaleDateString('fa-IR')
//           ),
//           datasets: [
//             {
//               label: 'وزن',
//               data: data.weightEntries.map((e) => e.weight),
//               borderColor: 'rgb(37, 99, 235)',
//               tension: 0.4,
//             },
//             {
//               label: 'وزن هدف',
//               data: data.weightEntries.map(() => data.goalWeight),
//               borderColor: 'rgb(239, 68, 68)',
//               borderDash: [5, 5],
//             },
//           ],
//         }}
//       />
//     </div>
//   );
// }
// WeightChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function WeightChart({ entries, goal }) {
  if (!entries || entries.length === 0) {
    return <p>هیچ داده‌ای موجود نیست</p>;
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h3 className="font-bold mb-4">نمودار پیشرفت وزن</h3>

      <Line
        data={{
          labels: entries.map((e) =>
            new Date(e.date).toLocaleDateString('fa-IR')
          ),
          datasets: [
            {
              label: 'وزن',
              data: entries.map((e) => e.weight),
              borderColor: 'rgb(37, 99, 235)',
              tension: 0.4,
            },
            {
              label: 'وزن هدف',
              data: entries.map(() => goal),
              borderColor: 'rgb(239, 68, 68)',
              borderDash: [5, 5],
            },
          ],
        }}
      />
    </div>
  );
}
