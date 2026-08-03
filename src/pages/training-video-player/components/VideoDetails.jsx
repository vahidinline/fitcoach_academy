import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const difficultyLabel = { beginner: 'مقدماتی', intermediate: 'متوسط', advanced: 'پیشرفته' };

export default function VideoDetails({ title, description, difficulty, duration, equipment, instructor, isBookmarked, onBookmark, attachments, className = '' }) {
  const [expanded, setExpanded] = useState('description');
  const safeAttachments = Array.isArray(attachments) ? attachments : [];
  const sections = [
    { id: 'description', icon: 'AlignRight', title: 'درباره این جلسه', visible: Boolean(description), content: <p className="text-sm leading-8 text-[#52605b]">{description}</p> },
    { id: 'attachments', icon: 'Paperclip', title: `فایل‌های همراه${safeAttachments.length ? ` (${safeAttachments.length})` : ''}`, visible: true, content: safeAttachments.length ? <div className="grid gap-3 sm:grid-cols-2">{safeAttachments.map((item, index) => <a key={item.url || index} href={item.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border border-[#dedad1] bg-[#fbfaf6] p-3 transition hover:border-[#df6b52]"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5e9e2] text-[#1c2c29]"><Icon name="FileText" size={19} /></span><span className="min-w-0 flex-1 truncate text-xs font-bold text-[#1c2c29]">{item.name || `پیوست ${index + 1}`}</span><Icon name="ExternalLink" size={15} className="text-[#87928e]" /></a>)}</div> : <p className="text-sm text-[#87928e]">برای این جلسه فایلی قرار نگرفته است.</p> },
    { id: 'equipment', icon: 'Dumbbell', title: 'وسایل مورد نیاز', visible: Array.isArray(equipment) && equipment.length > 0, content: <div className="flex flex-wrap gap-2">{equipment?.map((item) => <span key={item} className="rounded-full bg-[#e5e9e2] px-3 py-1.5 text-xs font-bold text-[#52605b]">{item}</span>)}</div> },
  ];
  return <section dir="rtl" className={`academy-surface overflow-hidden p-0 ${className}`}>
    <div className="bg-[#1c2c29] p-5 text-white sm:p-7">
      <div className="flex items-start justify-between gap-4"><div><p className="text-[11px] font-black tracking-wide text-[#efaa93]">جلسه آموزشی</p><h1 className="mt-2 text-xl font-black leading-8 sm:text-2xl">{title}</h1></div><button type="button" onClick={onBookmark} className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition ${isBookmarked ? 'bg-[#df6b52] text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`} aria-label="ذخیره ویدیو"><Icon name="Bookmark" size={20} className={isBookmarked ? 'fill-current' : ''} /></button></div>
      <div className="mt-5 flex flex-wrap gap-2 text-xs text-white/70">
        {duration ? <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5"><Icon name="Clock3" size={14} />{duration} دقیقه</span> : null}
        {difficulty ? <span className="rounded-full bg-white/10 px-3 py-1.5">سطح {difficultyLabel[difficulty?.toLowerCase()] || difficulty}</span> : null}
        {instructor ? <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5"><Icon name="UserRound" size={14} />{instructor}</span> : null}
      </div>
    </div>
    <div className="divide-y divide-[#e6e1d8] px-5 sm:px-7">{sections.filter((section) => section.visible).map((section) => <div key={section.id} className="py-5"><button type="button" onClick={() => setExpanded(expanded === section.id ? null : section.id)} className="flex w-full items-center justify-between text-right"><span className="flex items-center gap-2 font-black text-[#1c2c29]"><Icon name={section.icon} size={18} className="text-[#df6b52]" />{section.title}</span><Icon name="ChevronDown" size={19} className={`text-[#87928e] transition ${expanded === section.id ? 'rotate-180' : ''}`} /></button>{expanded === section.id && <div className="pt-4">{section.content}</div>}</div>)}</div>
  </section>;
}
