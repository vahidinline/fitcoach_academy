import React, { useEffect, useState } from 'react';
import api from 'api/api';
import Icon from '../../../components/AppIcon';

const typeInfo = {
  'body-analysis': { label: 'بادی آنالیز', icon: 'ScanLine' },
  'lab-test': { label: 'آزمایش پزشکی', icon: 'FlaskConical' },
};

export default function UserAttachments({ userId }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError('');
      try {
        const res = await api.get(`/report/attachments?userId=${userId}`);
        setList(res.data.attachments || []);
      } catch (err) { setError(err.response?.data?.error || 'دریافت فایل‌ها ناموفق بود.'); }
      finally { setLoading(false); }
    };
    if (userId) load();
  }, [userId]);

  return <section className="space-y-6" dir="rtl">
    <header className="flex items-start justify-between gap-4"><div><p className="academy-kicker">آرشیو شخصی</p><h3 className="mt-1 text-xl font-black text-[#1c2c29]">فایل‌های ضمیمه</h3><p className="mt-2 text-sm leading-7 text-[#66736e]">آزمایش‌ها و فایل‌های آنالیز بدنی شما به‌ترتیب زمان ثبت.</p></div><span className="rounded-full bg-[#1c2c29] px-3 py-1.5 text-xs font-bold text-white">{list.length} فایل</span></header>
    {loading && <div className="grid gap-3 sm:grid-cols-2">{[1,2,3,4].map((item) => <div key={item} className="h-24 animate-pulse rounded-2xl bg-[#eeebe4]" />)}</div>}
    {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">{error}</div>}
    {!loading && !error && list.length === 0 && <div className="rounded-[28px] border border-dashed border-[#cfd4cf] bg-[#f8f6f0] px-5 py-14 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#87928e] shadow-sm"><Icon name="FolderOpen" size={25} /></span><h4 className="mt-4 font-black text-[#1c2c29]">هنوز فایلی ثبت نشده است</h4><p className="mt-2 text-xs leading-6 text-[#87928e]">فایل‌های آزمایش و بادی آنالیز پس از آپلود اینجا قرار می‌گیرند.</p></div>}
    {!loading && list.length > 0 && <div className="grid gap-3 sm:grid-cols-2">{list.map((attachment) => {
      const info = typeInfo[attachment.type] || { label: 'فایل ضمیمه', icon: 'FileText' };
      return <a key={attachment._id} href={attachment.fileUrl} target="_blank" rel="noreferrer" className="group flex items-center gap-3 rounded-2xl border border-[#dedad1] bg-[#fbfaf6] p-4 transition hover:-translate-y-0.5 hover:border-[#df6b52] hover:bg-white hover:shadow-md"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e5e9e2] text-[#1c2c29] group-hover:bg-[#1c2c29] group-hover:text-white"><Icon name={info.icon} size={20} /></span><span className="min-w-0 flex-1"><strong className="block truncate text-sm text-[#1c2c29]">{attachment.originalName || info.label}</strong><span className="mt-1 flex items-center gap-2 text-[11px] text-[#87928e]"><span>{info.label}</span><span>•</span><span>{new Date(attachment.createdAt).toLocaleDateString('fa-IR')}</span></span></span><Icon name="ExternalLink" size={16} className="text-[#87928e]" /></a>;
    })}</div>}
  </section>;
}
