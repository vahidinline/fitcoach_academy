import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import api from 'api/api';

// Steps
import StepPersonal from './steps/StepPersonal';
import StepTraining from './steps/StepTraining';
import StepGoal from './steps/StepGoal';
import StepLifestyle from './steps/StepLifestyle';
import StepFinish from './steps/StepFinish';

export default function AssessmentWizard() {
  const userId = JSON.parse(localStorage.getItem('userData')).id;

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const containerRef = useRef(null);

  // -------------------------
  // 🔹 1) Load existing assessment if exists
  // -------------------------
  const loadAssessment = async () => {
    try {
      const res = await api.get(`/ShapeUpAssessment/${userId}`);

      if (res.data?.data) {
        console.log('Loaded assessment:', res.data.data);
        setForm(res.data.data);
        setIsEditing(true);
      } else {
        setIsEditing(false);
      }
    } catch (err) {
      console.log('No previous assessment found');
      setIsEditing(false);
    }
  };

  useEffect(() => {
    loadAssessment();
  }, []);

  // -------------------------
  // 🔹 GSAP animation for each step
  // -------------------------
  useEffect(() => {
    gsap.from(containerRef.current, {
      opacity: 0,
      x: 30,
      duration: 0.5,
      ease: 'power3.out',
    });
  }, [step]);

  // -------------------------
  // 🔹 2) Submit (create or update)
  // -------------------------
  const submit = async () => {
    try {
      if (isEditing) {
        await api.put(`/ShapeUpAssessment/${userId}`, form);
      } else {
        await api.post(`/ShapeUpAssessment`, { userId, ...form });
      }

      // Optional: show a better toast UI
      alert('اطلاعات ارزیابی با موفقیت ذخیره شد!');

      // Reload data & switch to edit mode
      await loadAssessment();
    } catch (error) {
      console.error(error);
      alert('خطا در ذخیره ارزیابی');
    }
  };

  // -------------------------
  // 🔹 3) Steps (must be AFTER defining submit)
  // -------------------------
  const steps = [
    <StepPersonal data={form} setData={setForm} />,
    <StepTraining data={form} setData={setForm} />,
    <StepGoal data={form} setData={setForm} />,
    <StepLifestyle data={form} setData={setForm} />,
    <StepFinish isEditing={isEditing} submit={submit} />,
  ];

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  return (
    <div className="p-4 max-w-lg mx-auto">
      {/* Step Dots */}
      <div className="flex justify-between mb-6">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded-full ${
              i <= step ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Step Content */}
      <div ref={containerRef}>{steps[step]}</div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        {step > 0 && (
          <button onClick={prev} className="btn-gray">
            قبلی
          </button>
        )}

        {step < steps.length - 1 ? (
          <button onClick={next} className="btn-primary">
            بعدی
          </button>
        ) : (
          <button onClick={submit} className="btn-primary">
            {isEditing ? 'به‌روزرسانی اطلاعات' : 'ثبت نهایی'}
          </button>
        )}
      </div>
    </div>
  );
}
