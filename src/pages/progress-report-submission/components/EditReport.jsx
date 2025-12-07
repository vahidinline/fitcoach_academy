import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from 'api/api';
import ExtraPhotosUpload from './ExtraPhotosUpload';
import ContextualHeader from 'components/ui/ContextualHeader';
import BottomTabNavigation from 'components/ui/BottomTabNavigation';
import { ArrowLeft } from 'lucide-react';

export default function EditReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [photos, setPhotos] = useState([]);
  const fileInputRef = useRef();
  const [status, setStatus] = useState('idle');
  const load = async () => {
    try {
      const res = await api.get(`/report/${id}`);
      setReport(res.data.report);

      // نمایش عکس‌های قبلی
      setPhotos(res.data.report.extraPhotos || []);

      setLoading(false);
    } catch (err) {
      console.error('load error', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const update = async () => {
    try {
      const payload = {
        avgCalories: report.avgCalories,
        avgSteps: report.avgSteps,
        strengthDays: report.strengthDays,
        cardioDays: report.cardioDays,
        proteinPercent: report.macros.protein,
        carbsPercent: report.macros.carbs,
        fatsPercent: report.macros.fat,
        note: report.note,

        // عکس‌های جدید + قبلی:
        extraPhotos: photos,
      };

      await api.put(`/report/${id}`, payload);

      alert('گزارش با موفقیت ویرایش شد');
      navigate('/progress-report-submission?tab=notes');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'خطا در ویرایش گزارش');
    }
  };

  // ------------------- حذف عکس -------------------
  const removePhoto = (url) => {
    setPhotos(photos.filter((p) => p !== url));
  };

  // ------------------- آپلود عکس جدید -------------------
  const uploadNewPhotos = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (!selectedFiles.length) return;
    setStatus('uploading');
    let newUrls = [...photos];

    for (let file of selectedFiles) {
      const formData = new FormData();
      formData.append('file', file);

      const res = await api.post('/report/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.url) newUrls.push(res.data.url);
    }

    setPhotos(newUrls);
    setStatus('uploaded');
  };

  if (loading)
    return (
      <div className="min-h-screen bg-background w-full">
        <ContextualHeader />
        <div className="mx-auto w-full max-w-sm rounded-md border border-blue-300 p-4">
          <div className="flex animate-pulse space-x-4">
            <div className="size-10 rounded-full bg-gray-200"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 rounded bg-gray-200"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 h-2 rounded bg-gray-200"></div>
                  <div className="col-span-1 h-2 rounded bg-gray-200"></div>
                </div>
                <div className="h-2 rounded bg-gray-200"></div>
              </div>
            </div>
          </div>
        </div>
        <BottomTabNavigation />
      </div>
    );

  return (
    <div className="min-h-screen bg-background w-full">
      <ContextualHeader />

      <div dir="rtl" className="pt-16 pb-20 lg:pl-64 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="justify-between my-3 flex flex-row">
            <span>
              {' '}
              <h2 className="text-xl font-bold">ویرایش گزارش</h2>
            </span>
            <span
              onClick={() => navigate('/progress-report-submission')}
              className="flex flex-row gap-2 cursor-pointer">
              <p> برگشت</p>

              <ArrowLeft />
            </span>
          </div>
          <div className="flex flex-col gap-5">
            <input
              type="number"
              value={report.avgCalories}
              onChange={(e) =>
                setReport({ ...report, avgCalories: Number(e.target.value) })
              }
              className="p-2 border rounded w-full"
            />

            <input
              type="number"
              value={report.avgSteps}
              onChange={(e) =>
                setReport({ ...report, avgSteps: Number(e.target.value) })
              }
              className="p-2 border rounded w-full"
            />

            <textarea
              value={report.note}
              onChange={(e) => setReport({ ...report, note: e.target.value })}
              className="p-2 border rounded w-full"
            />
            {status === 'uploading' ? (
              <div className="mx-auto w-full max-w-sm rounded-md border border-blue-300 p-4">
                <div className="flex animate-pulse space-x-4">
                  <div className="size-10 rounded-full bg-gray-200"></div>
                  <div className="flex-1 space-y-6 py-1">
                    <div className="h-2 rounded bg-gray-200"></div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 h-2 rounded bg-gray-200"></div>
                        <div className="col-span-1 h-2 rounded bg-gray-200"></div>
                      </div>
                      <div className="h-2 rounded bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="font-semibold">عکس‌های آپلود شده</label>

                <div className="grid grid-cols-4 gap-3 mt-2">
                  {photos.map((url) => (
                    <div key={url} className="relative group">
                      <img
                        src={url}
                        alt="extra"
                        className="w-48 h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removePhoto(url)}
                        className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                        حذف
                      </button>
                    </div>
                  ))}
                </div>

                {/* ------------------- افزودن عکس جدید ------------------- */}
                <button
                  className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg"
                  onClick={() => fileInputRef.current.click()}>
                  افزودن عکس جدید
                </button>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  ref={fileInputRef}
                  onChange={uploadNewPhotos}
                />
              </div>
            )}

            <button
              onClick={update}
              className="w-full bg-green-600 text-white p-3 rounded-xl">
              ذخیره تغییرات
            </button>
          </div>
          <BottomTabNavigation />
        </div>
      </div>
    </div>
  );
}
