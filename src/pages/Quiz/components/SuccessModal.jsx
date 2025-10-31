import React from 'react';
import { useNavigate } from 'react-router-dom';

function SuccessModal() {
  const navigate = useNavigate();
  return (
    <div
      dir="rtl"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg text-center max-w-md">
        <h2 className="text-2xl font-bold text-green-600 mb-3">🎉 تبریک!</h2>
        <p className="text-gray-700 mb-4">شما با موفقیت آزمون را گذراندید.</p>
        <button
          onClick={() => navigate('/request-for-certificate')}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition">
          ادامه به مرحله بعد
        </button>
      </div>
    </div>
  );
}

export default SuccessModal;
