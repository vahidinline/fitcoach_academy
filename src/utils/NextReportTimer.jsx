import React, { useEffect, useState } from 'react';
import { getTimeUntilNextMonday } from 'utils/nextMonday';

const NextReportTimer = () => {
  const [time, setTime] = useState(getTimeUntilNextMonday());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeUntilNextMonday());
    }, 60000); // هر دقیقه آپدیت

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-gray-700 text-sm mt-3 bg-white/40 backdrop-blur-md p-3 rounded-xl">
      <div className="font-bold">⏳ زمان باقی‌مانده تا دوشنبه بعدی:</div>
      <div>
        {time.diffDays} روز، {time.diffHours} ساعت، {time.diffMinutes} دقیقه
      </div>
    </div>
  );
};

export default NextReportTimer;
