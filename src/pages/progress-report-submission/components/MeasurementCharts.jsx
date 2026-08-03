import React, { useEffect, useState } from 'react';
import api from 'api/api';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler } from 'chart.js';
ChartJS.register(LineElement,PointElement,LinearScale,CategoryScale,Tooltip,Legend,Filler);
const metrics=[['waist','دور کمر','#df6b52'],['hips','دور باسن','#92765e'],['chest','دور سینه','#315a38'],['bicep','دور بازو','#c4933f']];
export default function MeasurementCharts({userId,refreshKey}){
  const [list,setList]=useState([]);const [loading,setLoading]=useState(true);
  useEffect(()=>{const fetchData=async()=>{try{setLoading(true);const res=await api.get(`/report/measurements/${userId}`);setList(res.data.measurements||[]);}catch{setList([]);}finally{setLoading(false);}};if(userId)fetchData();},[userId,refreshKey]);
  if(loading)return <div className="h-40 animate-pulse rounded-[24px] bg-[#eeebe4]"/>;
  if(!list.length)return <div className="rounded-[24px] border border-dashed border-[#cfd4cf] bg-[#f8f6f0] p-10 text-center"><h4 className="font-black text-[#1c2c29]">هنوز روندی برای نمایش وجود ندارد</h4><p className="mt-2 text-xs text-[#87928e]">پس از ثبت اولین اندازه، نمودارها اینجا نمایش داده می‌شوند.</p></div>;
  const labels=list.map((item)=>new Date(item.createdAt).toLocaleDateString('fa-IR'));
  return <section><div className="mb-4"><p className="academy-kicker">مقایسه در زمان</p><h4 className="mt-1 font-black text-[#1c2c29]">روند تغییر اندازه‌ها</h4></div><div className="grid gap-4 lg:grid-cols-2">{metrics.map(([field,label,color])=><div key={field} className="h-64 rounded-[24px] border border-[#e2ded5] bg-white p-4"><Line data={{labels,datasets:[{label,data:list.map((item)=>item[field]??null),borderColor:color,backgroundColor:`${color}18`,pointBackgroundColor:color,tension:.35,fill:true,spanGaps:true}]}} options={{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{usePointStyle:true,font:{family:'Vazirmatn'}}}},scales:{x:{grid:{display:false}},y:{grid:{color:'rgba(28,44,41,.06)'}}}}}/></div>)}</div></section>;
}
