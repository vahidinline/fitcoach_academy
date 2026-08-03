import React, { useRef, useState } from 'react';
import api from 'api/api';
import Icon from '../../../components/AppIcon';

export default function DocumentUploadPanel({ userId, endpoint, title, eyebrow, description, icon = 'FileUp' }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const selectFile = (selectedFile) => {
    setError('');
    setUploadedUrl(null);
    if (!selectedFile) return setFile(null);
    if (selectedFile.size > 10 * 1024 * 1024) return setError('حجم فایل باید کمتر از ۱۰ مگابایت باشد.');
    setFile(selectedFile);
  };

  const upload = async () => {
    if (!file) return setError('ابتدا یک فایل انتخاب کنید.');
    setUploading(true);
    setError('');
    const form = new FormData();
    form.append('file', file);
    form.append('userId', userId);
    try {
      const res = await api.post(endpoint, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUploadedUrl(res.data.attachment.fileUrl);
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
    } catch (err) {
      setError(err.response?.data?.error || 'آپلود ناموفق بود؛ دوباره تلاش کنید.');
    } finally { setUploading(false); }
  };

  return <section className="space-y-6" dir="rtl">
    <header className="flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1c2c29] text-white"><Icon name={icon} size={21} /></span><div><p className="academy-kicker">{eyebrow}</p><h3 className="mt-1 text-xl font-black text-[#1c2c29]">{title}</h3><p className="mt-2 text-sm leading-7 text-[#66736e]">{description}</p></div></header>
    <button type="button" onClick={() => inputRef.current?.click()} onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }} onDragOver={(e) => e.preventDefault()} onDragLeave={() => setDragActive(false)} onDrop={(e) => { e.preventDefault(); setDragActive(false); selectFile(e.dataTransfer.files?.[0]); }} className={`flex min-h-52 w-full flex-col items-center justify-center rounded-[28px] border-2 border-dashed px-5 text-center transition ${dragActive ? 'border-[#df6b52] bg-[#fff4ef]' : 'border-[#cfd4cf] bg-[#f8f6f0] hover:border-[#87928e]'}`}>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="hidden" onChange={(e) => selectFile(e.target.files?.[0])} />
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#df6b52] shadow-sm"><Icon name="CloudUpload" size={25} /></span>
      <strong className="mt-4 text-sm text-[#1c2c29]">فایل را اینجا رها کنید یا برای انتخاب کلیک کنید</strong>
      <span className="mt-2 text-xs text-[#87928e]">PDF، JPG، PNG یا WebP — حداکثر ۱۰ مگابایت</span>
    </button>
    {file && <div className="flex items-center gap-3 rounded-2xl border border-[#dedad1] bg-white p-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5e9e2] text-[#1c2c29]"><Icon name="FileText" size={19} /></span><span className="min-w-0 flex-1"><strong className="block truncate text-xs text-[#1c2c29]">{file.name}</strong><small className="text-[#87928e]">{(file.size / 1024 / 1024).toFixed(1)} مگابایت</small></span><button type="button" onClick={() => setFile(null)} className="rounded-xl p-2 text-[#87928e] hover:bg-red-50 hover:text-red-600"><Icon name="X" size={17} /></button></div>}
    {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-600">{error}</p>}
    {uploadedUrl && <a href={uploadedUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-[#bfcfbe] bg-[#edf4eb] p-4 text-sm font-bold text-[#315a38]"><span className="flex items-center gap-2"><Icon name="CircleCheck" size={19} />فایل با موفقیت ذخیره شد</span><span className="flex items-center gap-1 text-xs">مشاهده <Icon name="ExternalLink" size={14} /></span></a>}
    <button type="button" onClick={upload} disabled={!file || uploading} className="academy-primary-button w-full disabled:cursor-not-allowed disabled:opacity-45">{uploading ? 'در حال انتقال امن فایل…' : 'آپلود و ذخیره فایل'}</button>
  </section>;
}
