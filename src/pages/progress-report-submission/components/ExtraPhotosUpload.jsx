import React, { useState, useRef } from 'react';
import { gsap } from 'gsap';
import api from 'api/api';

export default function ExtraPhotosUpload({ maxFiles = 10, onChange }) {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]); // {id, preview, url, status}
  const [progress, setProgress] = useState({});

  const handlePick = (e) => {
    const list = Array.from(e.target.files || []);
    uploadList(list);
  };

  const uploadList = (list) => {
    if (files.length + list.length > maxFiles) {
      alert(`حداکثر ${maxFiles} عکس می‌توانید آپلود کنید.`);
      return;
    }

    list.forEach(upload);
  };

  const upload = async (file) => {
    const tempId = Date.now() + Math.random();

    setFiles((prev) => [
      ...prev,
      {
        id: tempId,
        preview: URL.createObjectURL(file),
        url: null,
        status: 'uploading',
      },
    ]);

    setProgress((p) => ({ ...p, [tempId]: 0 }));

    const formData = new FormData();
    formData.append('file', file);

    const interval = setInterval(() => {
      setProgress((p) => ({
        ...p,
        [tempId]: Math.min((p[tempId] || 0) + 10, 90),
      }));
    }, 200);

    try {
      const res = await api.post('/report/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      clearInterval(interval);

      setProgress((p) => ({ ...p, [tempId]: 100 }));

      const url = res.data.url;

      setFiles((prev) =>
        prev.map((f) => (f.id === tempId ? { ...f, status: 'done', url } : f))
      );

      // return URLs upward
      onChange &&
        onChange(
          [...files, { id: tempId, url }]
            .filter((x) => x.status !== 'uploading')
            .map((x) => x.url)
        );
    } catch (err) {
      clearInterval(interval);
      console.error('Upload failed', err);

      setFiles((prev) =>
        prev.map((f) => (f.id === tempId ? { ...f, status: 'failed' } : f))
      );
    }
  };

  const remove = (id) => {
    const newList = files.filter((f) => f.id !== id);
    setFiles(newList);
    onChange && onChange(newList.map((f) => f.url).filter(Boolean));
  };

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-gray-800 text-lg">آپلود تصاویر دلخواه</h3>

      <div
        onClick={() => fileInputRef.current.click()}
        className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer bg-gray-50 hover:bg-gray-100">
        <input
          type="file"
          multiple
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handlePick}
        />
        <p className="text-gray-600 text-sm">برای انتخاب عکس کلیک کنید</p>
        <p className="text-xs text-gray-400">
          {files.length} / {maxFiles}
        </p>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {files.map((f) => (
          <div
            key={f.id}
            className="relative border rounded-lg overflow-hidden">
            <img
              src={f.url || f.preview}
              className="w-full h-24 object-cover"
            />

            {f.status === 'uploading' && (
              <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center">
                <div className="text-center text-xs">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p>{Math.round(progress[f.id] || 0)}%</p>
                </div>
              </div>
            )}

            <button
              className="absolute top-1 left-1 bg-black/60 text-white text-xs rounded px-1"
              onClick={() => remove(f.id)}>
              حذف
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
