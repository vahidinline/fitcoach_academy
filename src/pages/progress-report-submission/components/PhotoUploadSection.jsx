import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import api from 'api/api';
import PhotoGallerySection from './PhotoGallerySection'; // اگر هنوز اینو نداری فعلاً کامنت کن
import Icon from '../../../components/AppIcon';

const PhotoUploadSection = ({ maxPhotos = 3 }) => {
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  const userId = JSON.parse(localStorage.getItem('userData') || '{}')?.id;

  const [photos, setPhotos] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // GSAP animation on mount
  useEffect(() => {
    if (containerRef.current) {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power3.out',
      });
    }
  }, []);

  // ---------- Drag handlers ----------
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave' || e.type === 'drop') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files || []);
    if (files.length) {
      handleFiles(files);
    }
  };

  // ---------- File input ----------
  const handleFileInput = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      handleFiles(files);
    }
  };

  // ---------- Validate & dispatch uploads ----------
  const handleFiles = (files) => {
    const valid = files.filter(
      (f) => f.type.startsWith('image/') && f.size <= 10 * 1024 * 1024
    );

    if (!valid.length) {
      alert('فایل معتبر پیدا نشد.');
      return;
    }

    if (photos.length + valid.length > maxPhotos) {
      alert(`حداکثر ${maxPhotos} تصویر می‌توانید آپلود کنید.`);
      return;
    }

    valid.forEach((file) => {
      uploadSingleFile(file);
    });
  };

  // ---------- Upload single file ----------
  const uploadSingleFile = async (file) => {
    const tempId = Date.now() + Math.random();
    const preview = URL.createObjectURL(file);

    // add temp photo
    setPhotos((prev) => [
      ...prev,
      { id: tempId, preview, url: null, status: 'uploading' },
    ]);

    setUploadProgress((prev) => ({ ...prev, [tempId]: 0 }));

    const formData = new FormData();
    formData.append('file', file); // backend expects req.files.file

    // fake progress until backend responds
    const interval = setInterval(() => {
      setUploadProgress((prev) => ({
        ...prev,
        [tempId]: Math.min((prev[tempId] || 0) + Math.random() * 15, 90),
      }));
    }, 200);

    try {
      const res = await api.post('/report/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      clearInterval(interval);

      const fileUrl = res.data.url;

      setUploadProgress((prev) => ({ ...prev, [tempId]: 100 }));

      setPhotos((prev) =>
        prev.map((p) =>
          p.id === tempId ? { ...p, url: fileUrl, status: 'completed' } : p
        )
      );

      // برای اینکه گالری پایین دوباره داده‌ها رو بگیره
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      clearInterval(interval);
      console.error('Upload error:', err);

      setPhotos((prev) =>
        prev.map((p) => (p.id === tempId ? { ...p, status: 'failed' } : p))
      );
    }
  };

  // ---------- Remove photo from local state ----------
  const removePhoto = (id) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    setUploadProgress((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  // ---------- Final submit (create photo-group) ----------
  const completedCount = photos.filter((p) => p.status === 'completed').length;
  const allCompleted =
    photos.length === maxPhotos &&
    photos.every((p) => p.status === 'completed');

  const handleSubmitGroup = async () => {
    if (!allCompleted) return;
    if (!userId) {
      alert('کاربر شناسایی نشد.');
      return;
    }

    const urls = photos.map((p) => p.url).filter(Boolean);

    try {
      await api.post('/report/photo-group', {
        userId,
        photos: urls,
      });

      alert('سری عکس با موفقیت ثبت شد.');

      // بعد از ثبت در دیتابیس، لوکال رو خالی می‌کنیم
      setPhotos([]);
      setUploadProgress({});
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error('Error saving photo group:', err);
      alert('در ثبت سری عکس خطایی رخ داد.');
    }
  };

  return (
    <div ref={containerRef} className="space-y-6">
      <header className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1c2c29] text-white"><Icon name="Images" size={21} /></span>
        <div><p className="academy-kicker">ثبت تصویری مسیر</p>
        <h3 className="mt-1 text-xl font-black text-[#1c2c29]">تصاویر پیشرفت</h3>
        <p className="mt-2 text-sm leading-7 text-[#66736e]">
          لطفاً حداکثر {maxPhotos} تصویر (مثلاً روبرو، نیم‌رخ و پشت) را برای این
          نوبت آپلود کنید.
        </p></div>
      </header>

      {/* Upload zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        className={`flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed p-6 text-center transition
          ${dragActive ? 'border-[#df6b52] bg-[#fff4ef]' : 'border-[#cfd4cf] bg-[#f8f6f0] hover:border-[#87928e]'}
        `}>
        <input
          type="file"
          multiple
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileInput}
        />
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#df6b52] shadow-sm"><Icon name="ImagePlus" size={25} /></span>
        <p className="mb-2 mt-4 text-sm font-black text-[#1c2c29]">
          برای انتخاب چند عکس کلیک کنید یا آن‌ها را بکشید و رها کنید
        </p>
        <p className="text-xs text-[#87928e]">
          JPG، PNG یا WebP — حداکثر ۱۰ مگابایت برای هر تصویر
        </p>
        <span className="mt-4 rounded-full bg-[#1c2c29] px-3 py-1 text-[11px] font-bold text-white">{photos.length} از {maxPhotos} تصویر</span>
      </div>

      {/* Local preview */}
      {photos.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative overflow-hidden rounded-[22px] border border-[#dedad1] bg-[#f3efe7]">
              <img
                src={photo.url || photo.preview}
                alt="پیش‌نمایش تصویر پیشرفت"
                className="h-52 w-full object-cover"
              />

              {photo.status === 'uploading' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1c2c29]/75 text-white backdrop-blur-sm">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <p className="mt-2 text-sm">
                    {Math.round(uploadProgress[photo.id] || 0)}%
                  </p>
                </div>
              )}

              {photo.status === 'failed' && (
                <p className="absolute inset-x-0 bottom-0 bg-red-600 py-2 text-center text-xs font-bold text-white">
                  خطا در آپلود
                </p>
              )}

              <button
                type="button"
                onClick={() => removePhoto(photo.id)}
                aria-label="حذف تصویر"
                className="absolute left-2 top-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-[#1c2c29] shadow transition hover:bg-red-600 hover:text-white">
                <Icon name="Trash2" size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Final submit button */}
      <button
        type="button"
        onClick={handleSubmitGroup}
        disabled={!allCompleted}
        className={`w-full rounded-2xl py-3.5 font-bold text-white transition
          ${
            allCompleted
              ? 'bg-[#1c2c29] hover:bg-[#263c38]'
              : 'cursor-not-allowed bg-[#c8cbc6]'
          }
        `}>
        ثبت نهایی این سری عکس‌ها
      </button>

      {/* Gallery (سری‌های قبلی) */}
      <PhotoGallerySection userId={userId} refreshKey={refreshKey} />
      {/* اگر فعلاً این کامپوننت را نداری، خط بالا و importش را کامنت کن */}
    </div>
  );
};

export default PhotoUploadSection;
