import { useEffect, useState, useRef } from 'react';
import api from 'api/api';

export default function Quiz() {
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [attemptsLeft, setAttemptsLeft] = useState(2);
  const [score, setScore] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showGuideModal, setShowGuideModal] = useState(true);
  const [showFailedModal, setShowFailedModal] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 min
  const [banTimeLeft, setBanTimeLeft] = useState(0); // seconds
  const [canRetry, setCanRetry] = useState(false);

  const userId = '22323';
  const banTimerRef = useRef(null);
  const quizTimerRef = useRef(null);

  // fetch on mount
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const [quizRes, progressRes] = await Promise.allSettled([
          api.get('/quiz'),
          api.get(`/quiz/progress/${userId}`),
        ]);

        // quiz
        if (quizRes.status === 'fulfilled') {
          if (!mounted) return;
          setQuiz(quizRes.value.data);
        } else {
          if (!mounted) return;
          setError('مشکل در بارگذاری سوالات آزمون.');
          return;
        }

        // progress
        if (progressRes.status === 'rejected' || !progressRes.value?.data) {
          // no progress -> fresh user
          if (!mounted) return;
          setAttemptsLeft(2);
          setShowGuideModal(true);
          setShowFailedModal(false);
          setCanRetry(true);
          setBanTimeLeft(0);
          return;
        }

        const {
          quizAttempts = 0,
          passed = false,
          twoWeekBanDate = null,
        } = progressRes.value.data || {};

        if (!mounted) return;
        setAttemptsLeft(Math.max(0, 2 - quizAttempts));

        if (quizAttempts >= 2 && passed === false) {
          setShowFailedModal(true);
          setShowGuideModal(false);
          setQuizStarted(false);

          if (twoWeekBanDate) {
            const now = new Date();
            const banEnd = new Date(twoWeekBanDate);
            const remainingSeconds = Math.max(
              0,
              Math.floor((banEnd - now) / 1000)
            );
            setBanTimeLeft(remainingSeconds);
            setCanRetry(remainingSeconds <= 0);
          } else {
            // safety fallback
            setBanTimeLeft(14 * 24 * 3600);
            setCanRetry(false);
          }
        } else {
          setShowGuideModal(true);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError('خطا در بارگذاری اولیه.');
      }
    };

    fetchData();

    return () => {
      mounted = false;
      clearInterval(banTimerRef.current);
      clearInterval(quizTimerRef.current);
    };
  }, [userId]);

  // quiz timer (30min)
  useEffect(() => {
    if (!quizStarted) return;
    if (timeLeft <= 0) {
      alert('زمان آزمون به پایان رسید!');
      window.history.back();
      return;
    }
    quizTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(quizTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(quizTimerRef.current);
  }, [quizStarted, timeLeft]);

  // ban countdown timer
  useEffect(() => {
    clearInterval(banTimerRef.current);
    if (banTimeLeft <= 0) {
      setCanRetry(true);
      setBanTimeLeft(0);
      return;
    }
    setCanRetry(false);
    banTimerRef.current = setInterval(() => {
      setBanTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(banTimerRef.current);
          setCanRetry(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(banTimerRef.current);
  }, [banTimeLeft]);

  // beforeunload warning
  useEffect(() => {
    const handler = (e) => {
      if (quizStarted && score === null) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [quizStarted, score]);

  const handleStart = () => {
    setShowGuideModal(false);
    setQuizStarted(true);
    setTimeLeft(1800);
  };

  const handleAnswerChange = (qIndex, optionIndex) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[qIndex] = optionIndex;
      return copy;
    });
  };

  const handleSubmit = async () => {
    setError('');
    setMessage('');
    if (!Array.isArray(answers) || answers.length !== quiz.length) {
      setError('لطفاً به تمام سؤال‌ها پاسخ دهید.');
      return;
    }
    try {
      const res = await api.post('/quiz/submit', { userId, answers });
      setScore(res.data.score);
      setAttemptsLeft(res.data.attemptsLeft);
      setMessage(res.data.message);
      setQuizStarted(false);

      if (!res.data.passed && res.data.attemptsLeft === 0) {
        // fetch progress to get twoWeekBanDate
        const pr = await api.get(`/quiz/progress/${userId}`);
        const twoWeekBanDate = pr.data.twoWeekBanDate;
        if (twoWeekBanDate) {
          const now = new Date();
          const banEnd = new Date(twoWeekBanDate);
          const remainingSeconds = Math.max(
            0,
            Math.floor((banEnd - now) / 1000)
          );
          setBanTimeLeft(remainingSeconds);
          setCanRetry(remainingSeconds <= 0);
          setShowFailedModal(true);
        } else {
          // fallback: show modal and ask server to set ban (should be set by submit)
          setShowFailedModal(true);
          setBanTimeLeft(14 * 24 * 3600);
          setCanRetry(false);
        }
      }
    } catch (err) {
      if (err.response?.data?.remainingSeconds) {
        // server said user is currently banned and returned remainingSeconds
        setBanTimeLeft(err.response.data.remainingSeconds);
        setCanRetry(false);
        setShowFailedModal(true);
      } else {
        setError(err.message || 'خطا در ارسال آزمون.');
      }
    }
  };

  // handleRetry uses server definitive answer
  const handleRetry = async () => {
    try {
      const { data } = await api.post('/quiz/retry', { userId });
      if (data.canRetry) {
        const q = await api.get('/quiz');
        setQuiz(q.data);
        setShowFailedModal(false);
        setAttemptsLeft(2);
        setQuizStarted(false);
        setAnswers([]);
        setScore(null);
        setMessage('');
        setBanTimeLeft(0);
        setCanRetry(true);
      } else {
        // server returned remainingSeconds — update it
        if (typeof data.remainingSeconds === 'number') {
          setBanTimeLeft(data.remainingSeconds);
          setCanRetry(false);
        }
        alert('هنوز دو هفته از آخرین تلاش شما نگذشته است.');
      }
    } catch (err) {
      console.error(err);
      alert('خطا در بررسی امکان امتحان مجدد.');
    }
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const formatCountdown = (seconds) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (d > 0) return `${d} روز ${h} ساعت ${m} دقیقه ${s} ثانیه`;
    return `${h}س ${m}د ${s}ث`;
  };

  // FAILED MODAL
  if (showFailedModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 max-w-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">
            شما ۲ بار تلاش کردید و موفق نشدید
          </h2>
          {banTimeLeft > 0 ? (
            <p className="mb-4 text-red-600">
              زمان باقی‌مانده تا امکان امتحان مجدد:{' '}
              {formatCountdown(banTimeLeft)}
            </p>
          ) : (
            <p className="mb-4 text-green-600">
              مدت محرومیت شما تمام شده است، می‌توانید دوباره امتحان دهید.
            </p>
          )}

          <button
            onClick={handleRetry}
            disabled={!canRetry}
            className={`py-2 px-6 rounded-xl transition mr-2 ${
              canRetry
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-400 text-gray-700 cursor-not-allowed'
            }`}>
            {canRetry
              ? 'امتحان مجدد'
              : `صبر کنید… (${formatCountdown(banTimeLeft)})`}
          </button>

          <button
            onClick={() => window.history.back()}
            className="bg-gray-300 text-gray-700 py-2 px-6 rounded-xl hover:bg-gray-400 transition">
            بازگشت
          </button>
        </div>
      </div>
    );
  }

  // GUIDE MODAL
  if (showGuideModal) {
    return (
      <div
        dir="rtl"
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 max-w-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">راهنمای آزمون</h2>
          <p className="mb-4 text-right">
            لطفاً قبل از شروع، تمام جلسات ضبط شده را با دقت مشاهده کنید. شما ۳۰
            دقیقه زمان دارید و می‌توانید حداکثر دو بار امتحان دهید.
          </p>
          <button
            onClick={handleStart}
            className="bg-blue-600 text-white py-2 px-6 rounded-xl hover:bg-blue-700 transition">
            شروع آزمون
          </button>
        </div>
      </div>
    );
  }

  // MAIN UI
  return (
    <div
      dir="rtl"
      className="max-w-xl mx-auto bg-white rounded-2xl shadow p-6 mt-10">
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
          {error}
        </div>
      )}
      {message && (
        <div className="bg-green-100 text-green-600 p-2 rounded-md mb-3 text-sm">
          {message}
        </div>
      )}

      {quiz.map((q, index) => (
        <div key={index} className="mb-6">
          <p className="font-medium text-gray-800 mb-2">
            {index + 1}. {q.question}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, i) => (
              <label
                key={i}
                className={`flex items-center space-x-2 border rounded-lg p-2 gap-2 cursor-pointer transition ${
                  answers[index] === i
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}>
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={i}
                  checked={answers[index] === i}
                  onChange={() => handleAnswerChange(index, i)}
                  className="accent-blue-500 "
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={attemptsLeft === 0}
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-xl mt-4 hover:bg-blue-700 transition">
        ارسال پاسخ‌ها
      </button>

      <div className="text-sm text-gray-500 text-center mt-4">
        تلاش‌های باقیمانده: {attemptsLeft}
      </div>

      {score !== null && (
        <div className="text-center mt-4 text-lg font-semibold text-gray-700">
          امتیاز شما: {score}
        </div>
      )}
    </div>
  );
}
