import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import api from 'api/api';
import PhotoGallerySection from './PhotoGallerySection'; // اگر هنوز اینو نداری فعلاً کامنت کن

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
      <div>
        <h3 className="text-lg font-bold text-gray-800">آپلود تصاویر پیشرفت</h3>
        <p className="text-sm text-gray-600">
          لطفاً حداکثر {maxPhotos} تصویر (مثلاً روبرو، نیم‌رخ و پشت) را برای این
          نوبت آپلود کنید.
        </p>
      </div>

      {/* Upload zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
        `}>
        <input
          type="file"
          multiple
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileInput}
        />
        <p className="text-gray-700 mb-2">
          برای انتخاب چند عکس کلیک کنید یا آن‌ها را بکشید و رها کنید
        </p>
        <p className="text-xs text-gray-500">
          {photos.length} / {maxPhotos}
        </p>
      </div>

      {/* Local preview */}
      {photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative rounded-lg border overflow-hidden">
              <img
                src={photo.url || photo.preview}
                alt="uploaded"
                className="w-full h-48 object-cover"
              />

              {photo.status === 'uploading' && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <p className="mt-2 text-sm">
                    {Math.round(uploadProgress[photo.id] || 0)}%
                  </p>
                </div>
              )}

              {photo.status === 'failed' && (
                <p className="absolute bottom-0 inset-x-0 bg-red-600 text-white text-xs text-center py-1">
                  خطا در آپلود
                </p>
              )}

              <button
                type="button"
                onClick={() => removePhoto(photo.id)}
                className="absolute top-2 left-2 bg-black/60 text-white rounded-full px-2 py-1 text-xs">
                حذف
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
        className={`w-full py-3 rounded-lg font-semibold text-white transition
          ${
            allCompleted
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-300 cursor-not-allowed'
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
