import { useEffect, useState, useRef } from 'react';
import api from 'api/api';
import BottomTabNavigation from 'components/ui/BottomTabNavigation';
import { useNavigationBlocker } from './components/NavigationBlocker';
import { useNavigate } from 'react-router-dom';
import FailedModal from './components/FailedModal';
import GuideModal from './components/GuideModal';
import Header from './components/Header';
import QuizSection from './components/QuizSection';
import SuccessModal from './components/SuccessModal';
import ContextualHeader from 'components/ui/ContextualHeader';

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
  const [isPassed, setIsPassed] = useState();
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [userId, setUserId] = useState(() => {
    // try to get from localStorage or generate new
    let user = localStorage.getItem('userData');
    if (user) {
      try {
        user = JSON.parse(user);
        if (user && user.id) {
          return user.id;
        }
      } catch (e) {
        console.error('Error parsing userData from localStorage', e);
      }
    }
  });

  const banTimerRef = useRef(null);
  const quizTimerRef = useRef(null);
  useNavigationBlocker(
    quizStarted && score === null,
    'شما هنوز آزمون خود را ارسال نکرده‌اید. آیا مطمئن هستید که می‌خواهید خارج شوید؟'
  );

  useEffect(() => {
    const user = localStorage.setItem('quizUserId', userId);
  }, []);
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

        if (passed) {
          setIsPassed(true);
          setShowGuideModal(false);
          setShowFailedModal(false);
          setQuizStarted(false);
          setShowSuccessModal(true);
          return;
        }

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

    // validate answers
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

      // ✅ Case 1: Passed
      if (res.data.passed) {
        setShowSuccessModal(true); // you’ll create this modal in your UI
        return;
      }

      // ✅ Case 2: Failed + reached 2 attempts → start 2-week ban
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
          // fallback if backend didn’t return date
          setShowFailedModal(true);
          setBanTimeLeft(14 * 24 * 3600);
          setCanRetry(false);
        }
      }
    } catch (err) {
      // ✅ Case 3: user is currently banned
      if (err.response?.data?.remainingSeconds) {
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

  // SUCCESS MODAL
  if (showSuccessModal) {
    return <SuccessModal />;
  }

  // FAILED MODAL
  if (showFailedModal) {
    return (
      <FailedModal
        banTimeLeft={banTimeLeft}
        formatCountdown={formatCountdown}
        handleRetry={handleRetry}
        canRetry={canRetry}
      />
    );
  }

  // GUIDE MODAL
  if (showGuideModal) {
    return <GuideModal handleStart={handleStart} />;
  }

  // MAIN UI
  return (
    <div className="academy-shell academy-grain" dir="rtl">
      <ContextualHeader />
      <main className="academy-page relative z-10">
      <div className="academy-surface mx-auto max-w-2xl p-5 sm:p-8">
      <div className="mb-6">
        <p className="academy-kicker">ارزیابی یادگیری</p>
        <h2 className="academy-title mt-2">آزمون دوره</h2>
      </div>
      <Header
        quizStarted={quizStarted}
        formatTime={formatTime}
        timeLeft={timeLeft}
        error={error}
        setError={setError}
        message={message}
      />

      {quiz.map((q, index) => (
        <QuizSection
          index={index}
          q={q}
          handleAnswerChange={handleAnswerChange}
          answers={answers}
        />
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
      </main>
      <BottomTabNavigation />
    </div>
  );
}
