import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function WeightChart({ entries, goal }) {
  if (!entries?.length) return <div className="rounded-2xl border border-dashed border-[#cfd4cf] bg-[#f8f6f0] p-8 text-center text-sm text-[#87928e]">با ثبت وزن جدید، نمودار مسیر شما اینجا ساخته می‌شود.</div>;
  return <section className="rounded-[24px] border border-[#e2ded5] bg-white p-4 sm:p-5"><div className="mb-5"><p className="academy-kicker">نمایش روند</p><h4 className="mt-1 font-black text-[#1c2c29]">نمودار تغییرات وزن</h4></div><div className="h-64 sm:h-80"><Line data={{ labels: entries.map((entry) => new Date(entry.date).toLocaleDateString('fa-IR')), datasets: [{ label:'وزن', data:entries.map((entry)=>entry.weight), borderColor:'#1c2c29', backgroundColor:'rgba(28,44,41,.08)', pointBackgroundColor:'#df6b52', pointBorderColor:'#fff', pointBorderWidth:3, pointRadius:5, tension:.35, fill:true }, { label:'وزن هدف', data:entries.map(()=>goal), borderColor:'#df6b52', borderDash:[7,7], pointRadius:0 }] }} options={{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ labels:{ usePointStyle:true, font:{ family:'Vazirmatn' } } } }, scales:{ x:{ grid:{ display:false } }, y:{ grid:{ color:'rgba(28,44,41,.07)' } } } }} /></div></section>;
}
