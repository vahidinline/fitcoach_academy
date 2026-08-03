import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../components/ui/AuthenticationGuard';
import api from 'api/api';
import { normalizeDigits } from 'utils/persianNumbers';

const RESEND_SECONDS = 60;

const getApiError = (error, fallback) =>
  error.response?.data?.error ||
  error.response?.data?.message ||
  error.message ||
  fallback;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [method, setMethod] = useState('mobile');
  const [identifier, setIdentifier] = useState('');
  const [pendingUser, setPendingUser] = useState(null);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('identifier');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const timer = window.setInterval(
      () => setResendIn((seconds) => Math.max(0, seconds - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [resendIn]);

  const normalizedIdentifier = useMemo(() => {
    if (method === 'mobile') return normalizeDigits(identifier).replace(/[\s-]/g, '');
    return identifier.trim().toLowerCase();
  }, [identifier, method]);

  const validateIdentifier = () => {
    if (method === 'mobile' && !/^09\d{9}$/.test(normalizedIdentifier)) {
      return 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم داشته باشد.';
    }
    if (
      method === 'email' &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedIdentifier)
    ) {
      return 'یک آدرس ایمیل معتبر وارد کنید.';
    }
    return '';
  };

  const requestOtp = async ({ isResend = false } = {}) => {
    const validationError = validateIdentifier();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const authData =
        method === 'mobile'
          ? { phoneNumber: normalizedIdentifier, method: 'sms' }
          : { email: normalizedIdentifier, method: 'email' };
      const { data } = await api.post('/academyAuth/login', authData);
      if (data.status !== 'ok') {
        throw new Error(data.error || data.message || 'ارسال کد انجام نشد.');
      }

      setPendingUser(authData);
      setOtp('');
      setStep('otp');
      setResendIn(RESEND_SECONDS);
    } catch (requestError) {
      setError(
        getApiError(
          requestError,
          isResend ? 'ارسال مجدد کد انجام نشد.' : 'ارسال کد تأیید انجام نشد.',
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    const normalizedOtp = normalizeDigits(otp).replace(/\D/g, '').slice(0, 6);
    if (!pendingUser) {
      setStep('identifier');
      setError('اطلاعات ورود پیدا نشد؛ دوباره درخواست کد بدهید.');
      return;
    }
    if (!/^\d{6}$/.test(normalizedOtp)) {
      setError('کد تأیید باید ۶ رقم باشد.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const { data } = await api.post('/academyAuth/verify-otp', {
        email: pendingUser.email,
        phone: pendingUser.phoneNumber,
        otp: normalizedOtp,
      });
      if (data.status !== 'ok' || !data.token) {
        throw new Error(data.error || 'کد تأیید صحیح نیست یا منقضی شده است.');
      }

      const result = await login({ ...data.userData, token: data.token });
      if (!result.success) throw new Error(result.error || 'ورود انجام نشد.');
      navigate('/user-dashboard', { replace: true });
    } catch (verifyError) {
      setError(getApiError(verifyError, 'بررسی کد تأیید انجام نشد.'));
    } finally {
      setIsLoading(false);
    }
  };

  const editIdentifier = () => {
    setStep('identifier');
    setPendingUser(null);
    setOtp('');
    setError('');
    setResendIn(0);
  };

  const displayIdentifier = pendingUser?.phoneNumber || pendingUser?.email;

  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[#f3efe7] font-vazir text-[#18211f]">
      <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full border-[54px] border-[#df6b52]/10" />
      <div className="absolute -bottom-36 left-[36%] h-96 w-96 rounded-full bg-[#d8e2d8]/70 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen max-w-[1440px] lg:grid-cols-[0.92fr_1.08fr]">
        <section className="order-2 flex items-center justify-center px-5 py-10 sm:px-10 lg:order-1 lg:px-16">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1c2c29] text-[#f3efe7] shadow-[0_12px_30px_rgba(28,44,41,0.18)]">
                  <Icon name="Activity" size={21} />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-tight">Shape Up Academy</p>
                  <p className="text-[11px] text-[#68716d]">فضای شخصی مسیر سلامتی شما</p>
                </div>
              </div>
              <span className="rounded-full border border-[#1c2c29]/10 bg-white/60 px-3 py-1 text-[10px] text-[#68716d] backdrop-blur">
                ورود امن با OTP
              </span>
            </div>

            <div className="rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-[0_30px_80px_rgba(28,44,41,0.11)] backdrop-blur-xl sm:p-9">
              {step === 'identifier' ? (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    requestOtp();
                  }}
                  noValidate>
                  <p className="mb-2 text-xs font-bold text-[#df6b52]">خوش آمدید</p>
                  <h1 className="text-3xl font-black tracking-[-0.04em] text-[#18211f] sm:text-[2.4rem]">
                    ادامه مسیر از همین‌جا
                  </h1>
                  <p className="mt-3 text-sm leading-7 text-[#68716d]">
                    روش دریافت کد یک‌بارمصرف را انتخاب کنید.
                  </p>

                  <div
                    role="tablist"
                    aria-label="روش ورود"
                    className="mt-7 grid grid-cols-2 rounded-2xl bg-[#ece9e1] p-1.5">
                    {[
                      { id: 'mobile', label: 'شماره موبایل', icon: 'Smartphone' },
                      { id: 'email', label: 'ایمیل', icon: 'Mail' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={method === item.id}
                        onClick={() => {
                          setMethod(item.id);
                          setIdentifier('');
                          setError('');
                        }}
                        className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-bold transition-all duration-300 ${
                          method === item.id
                            ? 'bg-[#1c2c29] text-white shadow-lg'
                            : 'text-[#68716d] hover:text-[#18211f]'
                        }`}>
                        <Icon name={item.icon} size={16} />
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <label className="mt-7 block text-xs font-bold text-[#394440]" htmlFor="login-identifier">
                    {method === 'mobile' ? 'شماره موبایل ایران' : 'آدرس ایمیل'}
                  </label>
                  <div className="relative mt-2">
                    <Icon
                      name={method === 'mobile' ? 'Phone' : 'AtSign'}
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#89918d]"
                    />
                    <input
                      id="login-identifier"
                      type={method === 'mobile' ? 'tel' : 'email'}
                      inputMode={method === 'mobile' ? 'numeric' : 'email'}
                      autoComplete={method === 'mobile' ? 'tel' : 'email'}
                      dir="ltr"
                      autoFocus
                      value={identifier}
                      onChange={(event) => {
                        setIdentifier(
                          method === 'mobile'
                            ? normalizeDigits(event.target.value)
                            : event.target.value,
                        );
                        if (error) setError('');
                      }}
                      placeholder={method === 'mobile' ? '0912 345 6789' : 'name@example.com'}
                      className={`h-14 w-full rounded-2xl border bg-[#fbfaf7] px-12 text-left text-sm outline-none transition-all placeholder:text-[#aeb4b1] focus:bg-white focus:ring-4 ${
                        error
                          ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                          : 'border-[#d9d9d1] focus:border-[#638176] focus:ring-[#638176]/10'
                      }`}
                    />
                  </div>

                  {error && (
                    <div role="alert" className="mt-3 flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-xs leading-5 text-red-700">
                      <Icon name="CircleAlert" size={16} className="mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#df6b52] text-sm font-bold text-white shadow-[0_16px_35px_rgba(223,107,82,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#cc5d46] disabled:cursor-not-allowed disabled:opacity-60">
                    {isLoading ? (
                      <><span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />در حال ارسال کد...</>
                    ) : (
                      <>دریافت کد ورود<Icon name="ArrowLeft" size={18} /></>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={verifyOtp} noValidate>
                  <button
                    type="button"
                    onClick={editIdentifier}
                    className="mb-7 flex items-center gap-2 text-xs font-bold text-[#68716d] transition hover:text-[#18211f]">
                    <Icon name="ArrowRight" size={16} />
                    ویرایش اطلاعات ورود
                  </button>

                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dce6df] text-[#35594d]">
                    <Icon name="MessageSquareText" size={24} />
                  </div>
                  <h1 className="text-3xl font-black tracking-[-0.04em]">کد تأیید را وارد کنید</h1>
                  <p className="mt-3 text-sm leading-7 text-[#68716d]">
                    کد ۶ رقمی برای <bdi dir="ltr" className="font-bold text-[#394440]">{displayIdentifier}</bdi> ارسال شد.
                  </p>

                  <input
                    aria-label="کد تأیید شش رقمی"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    dir="ltr"
                    autoFocus
                    maxLength={6}
                    value={otp}
                    onChange={(event) => {
                      setOtp(normalizeDigits(event.target.value).replace(/\D/g, '').slice(0, 6));
                      if (error) setError('');
                    }}
                    className={`mt-7 h-16 w-full rounded-2xl border bg-[#fbfaf7] px-4 text-center font-mono text-2xl font-bold tracking-[0.55em] outline-none transition-all focus:bg-white focus:ring-4 ${
                      error
                        ? 'border-red-300 focus:ring-red-100'
                        : 'border-[#d9d9d1] focus:border-[#638176] focus:ring-[#638176]/10'
                    }`}
                    placeholder="------"
                  />

                  {error && (
                    <div role="alert" className="mt-3 flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-xs leading-5 text-red-700">
                      <Icon name="CircleAlert" size={16} className="mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || otp.length !== 6}
                    className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#1c2c29] text-sm font-bold text-white shadow-[0_16px_35px_rgba(28,44,41,0.2)] transition-all hover:-translate-y-0.5 hover:bg-[#263b37] disabled:cursor-not-allowed disabled:opacity-40">
                    {isLoading ? (
                      <><span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />در حال بررسی...</>
                    ) : (
                      <>ورود به پنل<Icon name="LogIn" size={18} /></>
                    )}
                  </button>

                  <div className="mt-5 text-center text-xs text-[#68716d]">
                    {resendIn > 0 ? (
                      <span>ارسال مجدد کد تا {resendIn} ثانیه دیگر</span>
                    ) : (
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => requestOtp({ isResend: true })}
                        className="font-bold text-[#c45843] hover:underline disabled:opacity-50">
                        کد را دریافت نکردید؟ ارسال مجدد
                      </button>
                    )}
                  </div>
                </form>
              )}

              <div className="mt-8 flex items-center justify-center gap-2 border-t border-[#e7e4dd] pt-5 text-[10px] text-[#89918d]">
                <Icon name="ShieldCheck" size={14} />
                اطلاعات ورود شما رمزگذاری و محافظت می‌شود.
              </div>
            </div>
          </div>
        </section>

        <aside className="order-1 relative hidden min-h-screen overflow-hidden bg-[#1c2c29] p-16 text-[#f5f0e7] lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -left-24 top-24 h-72 w-72 rounded-full border-[1px] border-white/10" />
          <div className="absolute -left-8 top-40 h-44 w-44 rounded-full border-[1px] border-[#df6b52]/40" />
          <div className="relative flex items-center gap-2 text-xs text-white/60">
            <span className="h-2 w-2 rounded-full bg-[#df6b52]" />
            آکادمی آنلاین تناسب اندام
          </div>

          <div className="relative max-w-xl">
            <p className="mb-6 text-xs font-bold tracking-[0.24em] text-[#df8b77]">MOVE · NOURISH · EVOLVE</p>
            <h2 className="text-5xl font-black leading-[1.35] tracking-[-0.055em] xl:text-6xl">
              تغییر واقعی،
              <br />
              از تداوم‌های کوچک
              <br />
              ساخته می‌شود.
            </h2>
            <p className="mt-7 max-w-md text-sm leading-8 text-white/55">
              برنامه، گزارش‌های هفتگی و محتوای آموزشی شما در یک فضای شخصی و امن؛ برای مسیری که با ریتم زندگی شما هماهنگ است.
            </p>
          </div>

          <div className="relative grid grid-cols-3 gap-4 border-t border-white/10 pt-7">
            {[
              ['۱۲ هفته', 'برنامه هدفمند'],
              ['هر دوشنبه', 'پیگیری پیشرفت'],
              ['همیشه', 'دسترسی به آموزش'],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-sm font-bold text-[#f5f0e7]">{value}</p>
                <p className="mt-1 text-[10px] text-white/40">{label}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Login;
