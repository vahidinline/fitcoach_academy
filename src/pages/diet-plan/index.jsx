import React, { useEffect, useState } from 'react';
import { Download, FileText, Salad } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from 'api/api';
import ContextualHeader from 'components/ui/ContextualHeader';
import BottomTabNavigation from 'components/ui/BottomTabNavigation';

export default function DietPlan() {
  const navigate = useNavigate();
  const [state, setState] = useState({ loading: true, plan: null, error: '' });
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [pdfError, setPdfError] = useState('');
  useEffect(() => { const userId = JSON.parse(localStorage.getItem('userData') || '{}')?.id; if (!userId) return setState({ loading: false, plan: null, error: 'برای مشاهده رژیم وارد شوید.' }); api.get(`/diet-plans/my/${userId}?refresh=${Date.now()}`).then(({ data }) => setState({ loading: false, plan: data.plan, error: '' })).catch((error) => setState({ loading: false, plan: null, error: error.response?.data?.message || 'دریافت رژیم انجام نشد.' })); }, []);
  const requestPdf = async () => {
    const userId = JSON.parse(localStorage.getItem('userData') || '{}')?.id;
    if (!userId) return setPdfError('برای دریافت فایل وارد شوید.');
    setGeneratingPdf(true); setPdfError('');
    try {
      const { data } = await api.post(`/diet-plans/my/${userId}/generate-pdf`);
      setState((current) => ({ ...current, plan: data.plan, error: '' }));
      if (data.plan?.pdfUrl) window.location.assign(data.plan.pdfUrl);
    } catch (error) { setPdfError(error.response?.data?.message || 'آماده‌سازی فایل PDF انجام نشد.'); }
    finally { setGeneratingPdf(false); }
  };
  return <div className="academy-shell academy-grain"><ContextualHeader/><main dir="rtl" className="academy-page relative z-10"><p className="academy-kicker">Start by Azi</p><h2 className="academy-title mt-2">رژیم شخصی من</h2>{state.loading?<div className="mt-7 h-80 animate-pulse rounded-[2rem] bg-white/70"/>:state.error?<p className="mt-7 rounded-2xl bg-red-50 p-5 text-sm font-bold text-red-700">{state.error}</p>:!state.plan?<section className="academy-surface mt-7 max-w-2xl p-8 text-center"><Salad className="mx-auto text-[#df6b52]" size={36}/><h3 className="mt-4 text-lg font-black">رژیم شما در حال آماده‌سازی است</h3><p className="mt-2 text-sm leading-7 text-[#68716d]">اطلاعات اولیه‌تان ثبت شده است. پس از بررسی مربی، برنامه غذایی از همین‌جا در دسترس خواهد بود.</p></section>:<><section className="academy-surface mt-7 max-w-3xl p-5 sm:p-8"><div className="mb-6 flex items-center gap-3 border-b border-[#1c2c29]/10 pb-5"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f3efe7] text-[#df6b52]"><FileText size={21}/></span><div><h3 className="font-black">برنامه‌ی غذایی شما</h3><p className="mt-1 text-xs text-[#7a827e]">نسخه‌ی تأییدشده مربی</p></div></div><article className="whitespace-pre-wrap text-sm leading-8 text-[#35413d]">{state.plan.content}</article><button type="button" disabled={generatingPdf} onClick={requestPdf} className="academy-primary-button mt-7 inline-flex disabled:cursor-wait disabled:opacity-60"><Download size={17}/>{generatingPdf ? 'در حال آماده‌سازی نسخهٔ PDF…' : state.plan.pdfUrl ? 'دریافت فایل PDF' : 'ساخت و دریافت فایل PDF'}</button>{pdfError&&<p className="mt-3 text-sm text-red-600">{pdfError}</p>}</section><section className="academy-surface mt-5 max-w-3xl p-5 sm:p-7"><p className="academy-kicker">قدم بعدی</p><h3 className="mt-2 text-lg font-black">مایلید مسیرتان را ادامه دهید؟</h3><div className="mt-5 grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => navigate('/register')} className="academy-secondary-button justify-center">تمدید Start by Azi</button><button type="button" onClick={() => navigate('/register')} className="academy-primary-button justify-center">ثبت‌نام در دوره آکادمی</button></div></section></>}</main><BottomTabNavigation/></div>;
}
