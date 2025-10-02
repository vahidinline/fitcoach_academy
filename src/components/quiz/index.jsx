import api from 'api/api';
import { useState } from 'react';

const SessionQuiz = ({ quiz, sessionId, userId }) => {
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [message, setMessage] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(2);

  const handleAnswerChange = (questionIndex, selectedOption) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = selectedOption;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    try {
      // ارسال به سرور
      const response = await api.post('/quiz/submit', {
        userId: '1234',
        sessionId: '5678',
        answers,
      });

      setScore(response.data.score);
      setAttemptsLeft(response.data.attemptsLeft);
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      // fallback لوکال (اگر بخوای میشه نمره لوکال هم حساب بشه)
      let correctCount = 0;
      quiz.forEach((q, idx) => {
        if (answers[idx] === q.correctAnswer) correctCount++;
      });
      const percentage = (correctCount / quiz.length) * 100;
      setScore(percentage);
      setMessage('ارسال به سرور موفقیت‌آمیز نبود، نمره لوکال محاسبه شد.');
    }
  };

  return (
    <div dir="rtl" className="mx-5 my-2">
      {message && <div className="mb-2">{message}</div>}
      {score !== null && <div className="mb-2">امتیاز شما: {score}%</div>}
      <span>
        برای برخورداری از هدیه، می بایست حداقل ۹۰٪ سوالات را درست پاسخ دهید. بعد
        از مشاهده هر جلسه، ۴ سوال ۴ گزینه‌ای از شما پرسیده می‌شود. شما دو بار
        فرصت دارید که تست هر جلسه را انجام دهید.
      </span>
      {quiz.length > 0 && attemptsLeft > 0 && (
        <div className="bg-warning border border-main rounded p-2 my-3">
          شما {attemptsLeft} بار دیگر می‌توانید تلاش کنید
        </div>
      )}
      {quiz.map((q, index) => (
        <div className="border rounded p-5 my-2" key={index}>
          <p className="font-bold text-xl mx-2 mb-3 border-b">{q.question}</p>
          <div className="flex flex-col">
            {q.options.map((option, optionIndex) => (
              <label key={optionIndex} className="cursor-pointer">
                <input
                  className="mx-2"
                  type="radio"
                  name={`question-${index}`}
                  value={optionIndex}
                  checked={answers[index] === optionIndex}
                  onChange={() => handleAnswerChange(index, optionIndex)}
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      ))}
      {quiz.length > 0 && attemptsLeft > 0 && (
        <button className="btn bg-success text-white" onClick={handleSubmit}>
          ثبت پاسخ
        </button>
      )}
    </div>
  );
};
export default SessionQuiz;
