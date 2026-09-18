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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);

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
        setFailedAttempts(quizAttempts);

        if (passed) {
          setIsPassed(true);
          setShowGuideModal(false);
          setShowFailedModal(false);
          setQuizStarted(false);
          setShowSuccessModal(true);
          return;
        }

        if (twoWeekBanDate && new Date(twoWeekBanDate) > new Date() && passed === false) {
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

  const handleStart = async () => {
    try {
      const { data } = await api.post('/quiz/start', { userId });
      setShowGuideModal(false);
      setQuizStarted(true);
      setTimeLeft(data.expiresAt ? Math.max(0, Math.floor((new Date(data.expiresAt) - Date.now()) / 1000)) : 1800);
      setCurrentIndex(0);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'امکان شروع آزمون وجود ندارد.');
    }
  };

  const handleAnswerChange = (qIndex, optionIndex) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[qIndex] = optionIndex;
      return copy;
    });
  };
  const currentQuestion = quiz[currentIndex];
  const hasCurrentAnswer = Number.isInteger(answers[currentIndex]);
  const goNext = () => {
    if (!hasCurrentAnswer) {
      setError('لطفاً یک گزینه را انتخاب کنید.');
      return;
    }
    setError('');
    setCurrentIndex((index) => Math.min(index + 1, quiz.length - 1));
  };
  const goPrevious = () => {
    setError('');
    setCurrentIndex((index) => Math.max(index - 1, 0));
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (!quizStarted || !currentQuestion) return;
      if (event.key === 'ArrowLeft' && currentIndex < quiz.length - 1) goNext();
      if (event.key === 'ArrowRight' && currentIndex > 0) goPrevious();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [quizStarted, currentIndex, currentQuestion, hasCurrentAnswer]);
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
      setFailedAttempts((value) => value + 1);
      setMessage(res.data.message);
      setQuizStarted(false);

      // ✅ Case 1: Passed
      if (res.data.passed) {
        setShowSuccessModal(true); // you’ll create this modal in your UI
        return;
      }

      // Every failed attempt enters a server-defined cooldown.
      if (!res.data.passed) {
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
          setShowFailedModal(true);
          setBanTimeLeft(2 * 24 * 3600);
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
        const startsNewCycle = failedAttempts >= 2;
        setAttemptsLeft(startsNewCycle ? 2 : 1);
        if (startsNewCycle) setFailedAttempts(0);
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
          failedAttempts={failedAttempts}
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
      <div className="academy-surface mx-auto max-w-3xl overflow-hidden p-5 sm:p-10">
        <div className="mb-8 flex items-start justify-between gap-5">
          <div>
            <p className="academy-kicker">ارزیابی یادگیری</p>
            <h2 className="academy-title mt-2">آزمون دوره</h2>
            <p className="mt-2 text-sm text-[#68736e]">هر بار فقط روی یک سؤال تمرکز کن.</p>
          </div>
          <div className="rounded-2xl bg-[#edf1e8] px-4 py-3 text-left text-sm text-[#41534b]">
            <span className="block text-xs text-[#7a8980]">زمان باقی‌مانده</span>
            <strong className="mt-1 block font-mono text-lg">{formatTime(timeLeft)}</strong>
          </div>
        </div>

        {error && <div role="alert" className="mb-5 rounded-2xl border border-[#e9b6a9] bg-[#fff2ee] px-4 py-3 text-sm text-[#a74735]">{error}</div>}
        {message && <div className="mb-5 rounded-2xl bg-[#eaf5ef] px-4 py-3 text-sm text-[#287044]">{message}</div>}

        {currentQuestion && quizStarted && (
          <>
            <div className="mb-9 flex items-center gap-4">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#e7ebe4]">
                <div className="h-full rounded-full bg-[#df6b52] transition-all duration-500" style={{ width: `${((currentIndex + 1) / quiz.length) * 100}%` }} />
              </div>
              <span className="whitespace-nowrap text-sm font-semibold text-[#52625a]">{currentIndex + 1} از {quiz.length}</span>
            </div>
            <div className="min-h-[410px] animate-[fadeIn_.35s_ease-out]">
              <p className="mb-4 text-sm font-semibold text-[#df6b52]">سؤال {String(currentIndex + 1).padStart(2, '۰')}</p>
              <h3 className="max-w-2xl text-2xl font-bold leading-[1.7] text-[#20332d] sm:text-3xl">{currentQuestion.question}</h3>
              <div className="mt-9 grid gap-3">
                {currentQuestion.options.map((option, optionIndex) => (
                  <button type="button" key={optionIndex} onClick={() => handleAnswerChange(currentIndex, optionIndex)} className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-right transition duration-200 ${answers[currentIndex] === optionIndex ? 'border-[#df6b52] bg-[#fff2ee] shadow-[0_8px_24px_rgba(223,107,82,.12)]' : 'border-[#dce4db] bg-white hover:-translate-y-0.5 hover:border-[#9daf9f] hover:shadow-md'}`}>
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${answers[currentIndex] === optionIndex ? 'bg-[#df6b52] text-white' : 'bg-[#eef2ec] text-[#647269]'}`}>{String.fromCharCode(1575 + optionIndex)}</span>
                    <span className="text-base leading-7 text-[#31433b]">{option}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-[#e7ebe4] pt-6">
              <button type="button" onClick={goPrevious} disabled={currentIndex === 0} className="rounded-xl px-4 py-3 text-sm font-semibold text-[#65746c] transition hover:bg-[#edf1e8] disabled:invisible">سؤال قبل</button>
              {currentIndex === quiz.length - 1 ? <button type="button" onClick={handleSubmit} disabled={!hasCurrentAnswer || attemptsLeft === 0} className="rounded-xl bg-[#df6b52] px-6 py-3 text-sm font-bold text-white shadow-[0_10px_22px_rgba(223,107,82,.22)] transition hover:bg-[#c95742] disabled:cursor-not-allowed disabled:opacity-50">ثبت و مشاهده نتیجه</button> : <button type="button" onClick={goNext} className="rounded-xl bg-[#20332d] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#314d42] disabled:opacity-50">سؤال بعد <span className="mr-2">←</span></button>}
            </div>
            <p className="mt-5 text-center text-xs text-[#829087]">برای جابه‌جایی سریع می‌توانی از کلیدهای ← و → استفاده کنی</p>
          </>
        )}
      </div>
      </main>
      <BottomTabNavigation />
    </div>
  );
}
