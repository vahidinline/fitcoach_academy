import React from 'react';

function Header({
  quizStarted,
  formatTime,
  timeLeft,
  error,
  setError,
  message,
}) {
  return (
    <div className="mb-6 text-center fixed bg-white top-0 left-0 right-0 py-4 px-6 shadow-md z-10">
      <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
        آزمون آکادمی تغذیه
      </h2>

      {quizStarted && (
        <div className="text-center text-gray-700 mb-4">
          زمان باقی‌مانده: {formatTime(timeLeft)}
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-600 p-2 rounded-md mb-3 text-sm">
          {error}{' '}
          <span
            onClick={() => setError(null)}
            className="cursor-pointer  float-left font-bold">
            بستن
          </span>
        </div>
      )}
      {message && (
        <div className="bg-green-100 text-green-600 p-2 rounded-md mb-3 text-sm">
          {message}
        </div>
      )}
    </div>
  );
}

export default Header;
