import React, { useEffect, useState } from 'react';

function getCountdownUntilTonight() {
  const now = new Date();
  const tonight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59
  );

  const diffMs = tonight - now;
  if (diffMs <= 0) return null;

  return {
    hours: Math.floor(diffMs / (1000 * 60 * 60)),
    minutes: Math.floor((diffMs / (1000 * 60)) % 60),
    seconds: Math.floor((diffMs / 1000) % 60),
  };
}

const ReportCountdown = () => {
  const [time, setTime] = useState(getCountdownUntilTonight());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCountdownUntilTonight());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  return (
    <div className="mt-3 p-3 bg-yellow-100 text-yellow-800 rounded-xl text-center">
      ⏰ زمان باقی‌مانده تا پایان امروز:
      <div className="font-bold text-lg">
        {time.hours} : {time.minutes} : {time.seconds}
      </div>
    </div>
  );
};

export default ReportCountdown;
