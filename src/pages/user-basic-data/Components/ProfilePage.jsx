import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import api from 'api/api';
import Icon from '../../../components/AppIcon';
import { useNavigate } from 'react-router-dom';

const fields = [
  { key: 'name', label: 'نام و نام خانوادگی', type: 'text', icon: 'User', placeholder: 'نام شما' },
  { key: 'email', label: 'ایمیل', type: 'email', icon: 'Mail', placeholder: 'name@example.com', dir: 'ltr' },
  { key: 'phoneNumber', label: 'شماره موبایل', type: 'tel', icon: 'Phone', placeholder: '09xxxxxxxxx', dir: 'ltr' },
  { key: 'instagram', label: 'اینستاگرام', type: 'text', icon: 'Instagram', placeholder: 'username', dir: 'ltr' },
  { key: 'location', label: 'شهر محل سکونت', type: 'text', icon: 'MapPin', placeholder: 'مثلاً تهران' },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = user.id;
  const [profile, setProfile] = useState({ name: '', email: '', phoneNumber: '', instagram: '', location: '', photo: '' });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (containerRef.current) gsap.from(containerRef.current, { opacity: 0, y: 18, duration: 0.5, ease: 'power3.out' });
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get(`/api/client/${userId}`);
        setProfile((current) => ({ ...current, ...res.data }));
      } catch (err) {
        console.warn('Profile not found yet.');
      }
    };
    if (userId) loadProfile();
  }, [userId]);

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return alert('لطفاً یک فایل تصویری انتخاب کنید.');
    if (file.size > 8 * 1024 * 1024) return alert('حجم تصویر باید کمتر از ۸ مگابایت باشد.');
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/report/upload-image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProfile((current) => ({ ...current, photo: res.data.url }));
    } catch (err) {
      console.error('Upload failed:', err);
      alert('آپلود عکس ناموفق بود. دوباره تلاش کنید.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const saveProfile = async () => {
    if (uploading) return;
    if (!profile.name?.trim() || !profile.location?.trim() || (!profile.email?.trim() && !profile.phoneNumber?.trim())) {
      setFeedback({ type: 'error', text: 'برای تکمیل پروفایل، نام، شهر محل زندگی و حداقل ایمیل یا شماره موبایل را وارد کنید.' });
      return;
    }
    setLoading(true);
    setFeedback(null);
    try {
      await api.put(`/api/client/profile/${userId}`, profile);
      setFeedback({ type: 'success', text: 'پروفایل با موفقیت ذخیره شد؛ در حال بازگشت به داشبورد…' });
      window.setTimeout(() => navigate('/user-dashboard'), 1200);
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', text: err.response?.data?.message || 'خطا در ذخیره پروفایل. دوباره تلاش کنید.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="mx-auto max-w-3xl space-y-6" dir="rtl">
      <section className="academy-surface overflow-hidden p-0">
        <div className="bg-[#1c2c29] px-5 py-7 text-white sm:px-8">
          <p className="academy-kicker !text-[#efaa93]">حساب من</p>
          <h2 className="mt-2 text-2xl font-black">پروفایل شخصی</h2>
          <p className="mt-2 max-w-xl text-sm leading-7 text-white/65">اطلاعات تماس و تصویر شما فقط برای مدیریت بهتر مسیر و ارتباط با تیم آکادمی استفاده می‌شود.</p>
        </div>

        <div className="grid gap-7 p-5 sm:p-8 md:grid-cols-[190px_1fr]">
          <div className="flex flex-col items-center self-start rounded-[28px] bg-[#f3efe7] p-5 text-center">
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="group relative h-32 w-32 overflow-hidden rounded-[32px] border-4 border-white bg-[#dfe4dc] shadow-sm disabled:cursor-wait" aria-label="تغییر تصویر پروفایل">
              {profile.photo ? <img src={profile.photo} alt="تصویر پروفایل" className="h-full w-full object-cover" /> : <Icon name="User" size={42} className="mx-auto text-[#66736e]" />}
              <span className="absolute inset-x-2 bottom-2 rounded-full bg-[#1c2c29]/85 px-2 py-1.5 text-[11px] font-bold text-white backdrop-blur">{uploading ? 'در حال آپلود…' : 'تغییر تصویر'}</span>
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} />
            <p className="mt-3 text-xs leading-6 text-[#66736e]">JPG، PNG یا WebP<br />حداکثر ۸ مگابایت</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {feedback && <p className={`sm:col-span-2 rounded-2xl p-3 text-xs font-bold ${feedback.type === 'success' ? 'bg-[#dce6df] text-[#29483e]' : 'bg-red-50 text-red-700'}`}>{feedback.text}</p>}
            {fields.map((field) => (
              <label key={field.key} className={field.key === 'name' || field.key === 'location' ? 'sm:col-span-2' : ''}>
                <span className="mb-2 block text-xs font-bold text-[#52605b]">{field.label}</span>
                <span className="relative block">
                  <Icon name={field.icon} size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#87928e]" />
                  <input type={field.type} dir={field.dir} placeholder={field.placeholder} value={profile[field.key] || ''} onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })} className={`h-12 w-full rounded-2xl border border-[#dcd8cf] bg-white px-11 text-sm text-[#1c2c29] outline-none transition focus:border-[#df6b52] focus:ring-4 focus:ring-[#df6b52]/10 ${field.dir === 'ltr' ? 'text-left' : 'text-right'}`} />
                </span>
              </label>
            ))}
            <button onClick={saveProfile} disabled={loading || uploading} className="academy-primary-button mt-2 sm:col-span-2 disabled:cursor-not-allowed disabled:opacity-60">
              {uploading ? 'منتظر تکمیل آپلود…' : loading ? 'در حال ذخیره…' : 'ذخیره تغییرات'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
