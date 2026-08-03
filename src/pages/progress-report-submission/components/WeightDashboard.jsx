import React, { useEffect, useState } from 'react';
import api from 'api/api';
import AddWeightEntry from './AddWeightEntry';
import WeightChart from './WeightChart';
import InitialWeightForm from './InitialWeightForm';
import Icon from '../../../components/AppIcon';

export default function WeightDashboard() {
  const userId = JSON.parse(localStorage.getItem('userData') || '{}')?.id;
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = async () => { try { setLoading(true); setError(''); const res = await api.get(`/report/weight/${userId}`); setRecord(res.data.data || null); } catch (err) { if (err.response?.status !== 404) setError('دریافت اطلاعات وزن ناموفق بود.'); setRecord(null); } finally { setLoading(false); } };
  useEffect(() => { if (userId) load(); }, [userId]);
  if (loading) return <div className="flex min-h-72 items-center justify-center"><span className="h-9 w-9 animate-spin rounded-full border-2 border-[#1c2c29]/15 border-t-[#df6b52]" /></div>;
  if (error) return <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">{error}</div>;
  if (!record) return <InitialWeightForm onComplete={load} />;

  const { startingWeight, goalWeight, weightEntries = [] } = record;
  const sortedEntries = [...weightEntries].sort((a, b) => new Date(a.date) - new Date(b.date));
  const currentWeight = sortedEntries.at(-1)?.weight ?? startingWeight;
  const change = Number(currentWeight) - Number(startingWeight);
  const totalJourney = Number(startingWeight) - Number(goalWeight);
  const completedJourney = Number(startingWeight) - Number(currentWeight);
  const progressPercent = totalJourney === 0 ? 100 : Math.max(0, Math.min(100, (completedJourney / totalJourney) * 100));
  const cards = [['وزن شروع', startingWeight, 'Flag'], ['وزن فعلی', currentWeight, 'Activity'], ['وزن هدف', goalWeight, 'Target'], ['تغییر ثبت‌شده', `${change > 0 ? '+' : ''}${change.toFixed(1)}`, 'TrendingDown']];

  return <div className="space-y-6" dir="rtl">
    <header><p className="academy-kicker">ردپای تغییر</p><h3 className="mt-1 text-xl font-black text-[#1c2c29]">روند وزن</h3><p className="mt-2 text-sm leading-7 text-[#66736e]">عددها فقط یک نشانه‌اند؛ روند پیوسته تصویر دقیق‌تری از مسیر شما می‌سازد.</p></header>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{cards.map(([label,value,icon], index) => <div key={label} className={`rounded-2xl p-4 ${index === 1 ? 'bg-[#1c2c29] text-white' : 'border border-[#e2ded5] bg-[#fbfaf6] text-[#1c2c29]'}`}><Icon name={icon} size={17} className={index === 1 ? 'text-[#efaa93]' : 'text-[#df6b52]'} /><span className={`mt-4 block text-[11px] font-bold ${index === 1 ? 'text-white/55' : 'text-[#87928e]'}`}>{label}</span><strong className="mt-1 block text-xl font-black" dir="ltr">{value} <small className="text-xs font-bold opacity-50">kg</small></strong></div>)}</div>
    <div className="rounded-[24px] border border-[#d8ded8] bg-[#eef3ed] p-5"><div className="flex items-center justify-between"><strong className="text-sm text-[#29483e]">پیشرفت تا هدف</strong><span className="text-sm font-black text-[#29483e]">{progressPercent.toFixed(0)}٪</span></div><div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-[#df6b52] transition-all duration-700" style={{ width: `${progressPercent}%` }} /></div></div>
    <WeightChart entries={sortedEntries} goal={goalWeight} />
    <AddWeightEntry userId={userId} onAdded={load} />
  </div>;
}
