import React, { useEffect, useState, useRef } from 'react';
import api from 'api/api';

export default function ExtraPhotosUpload({ maxFiles = 10, onChange, onStatusChange }) {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]); // {id, preview, url, status}
  const [progress, setProgress] = useState({});

  useEffect(() => {
    onStatusChange?.(files.some((file) => file.status === 'uploading'));
  }, [files, onStatusChange]);

  useEffect(
    () => () => files.forEach((file) => file.preview && URL.revokeObjectURL(file.preview)),
    [],
  );

  const handlePick = (e) => {
    const list = Array.from(e.target.files || []);
    uploadList(list);
  };

  const uploadList = (list) => {
    const valid = list.filter(
      (file) => file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024,
    );
    if (valid.length !== list.length) {
      alert('فقط تصویر با حجم حداکثر ۱۰ مگابایت مجاز است.');
    }
    if (files.length + valid.length > maxFiles) {
      alert(`حداکثر ${maxFiles} عکس می‌توانید آپلود کنید.`);
      return;
    }

    if (valid.length > 0) onStatusChange?.(true);
    valid.forEach(upload);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const upload = async (file) => {
    onStatusChange?.(true);
    const tempId = Date.now() + Math.random();

    // ابتدا فایل را به صورت موقت اضافه می‌کنیم
    setFiles((prev) => [
      ...prev,
      {
        id: tempId,
        preview: URL.createObjectURL(file),
        file,
        url: null,
        status: 'uploading',
      },
    ]);

    setProgress((p) => ({ ...p, [tempId]: 0 }));

    const interval = setInterval(() => {
      setProgress((p) => ({
        ...p,
        [tempId]: Math.min((p[tempId] || 0) + 10, 90),
      }));
    }, 200);

    try {
      let res;
      let lastError;
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          res = await api.post('/report/upload-image', formData);
          break;
        } catch (error) {
          lastError = error;
          const retryable = !error.response || error.response.status >= 500;
          if (!retryable || attempt === 1) throw error;
        }
      }
      if (!res) throw lastError;

      clearInterval(interval);

      const url = res.data.url;

      // 🔥 مهم: اینجا باید از callback استفاده کنیم تا state همیشه جدید باشد
      setFiles((prev) => {
        const updated = prev.map((f) =>
          f.id === tempId ? { ...f, url, status: 'done' } : f
        );

        // ارسال لیست URL ها
        onChange && onChange(updated.filter((f) => f.url).map((f) => f.url));

        return updated;
      });

      setProgress((p) => ({ ...p, [tempId]: 100 }));
    } catch (err) {
      clearInterval(interval);
      console.error('Upload failed', err);

      setFiles((prev) =>
        prev.map((f) => (f.id === tempId ? { ...f, status: 'failed' } : f))
      );
    }
  };

  const retry = (item) => {
    const preview = item.preview;
    setFiles((prev) => prev.filter((file) => file.id !== item.id));
    if (preview) URL.revokeObjectURL(preview);
    upload(item.file);
  };

  // const upload = async (file) => {
  //   const tempId = Date.now() + Math.random();

  //   setFiles((prev) => [
  //     ...prev,
  //     {
  //       id: tempId,
  //       preview: URL.createObjectURL(file),
  //       url: null,
  //       status: 'uploading',
  //     },
  //   ]);

  //   setProgress((p) => ({ ...p, [tempId]: 0 }));

  //   const formData = new FormData();
  //   formData.append('file', file);

  //   const interval = setInterval(() => {
  //     setProgress((p) => ({
  //       ...p,
  //       [tempId]: Math.min((p[tempId] || 0) + 10, 90),
  //     }));
  //   }, 200);

  //   try {
  //     const res = await api.post('/report/upload-image', formData, {
  //       headers: { 'Content-Type': 'multipart/form-data' },
  //     });

  //     clearInterval(interval);

  //     setProgress((p) => ({ ...p, [tempId]: 100 }));

  //     const url = res.data.url;

  //     setFiles((prev) =>
  //       prev.map((f) => (f.id === tempId ? { ...f, status: 'done', url } : f))
  //     );

  //     // return URLs upward
  //     onChange &&
  //       onChange(
  //         [...files, { id: tempId, url }]
  //           .filter((x) => x.status !== 'uploading')
  //           .map((x) => x.url)
  //       );
  //   } catch (err) {
  //     clearInterval(interval);
  //     console.error('Upload failed', err);

  //     setFiles((prev) =>
  //       prev.map((f) => (f.id === tempId ? { ...f, status: 'failed' } : f))
  //     );
  //   }
  // };

  const remove = (id) => {
    const removed = files.find((file) => file.id === id);
    if (removed?.preview) URL.revokeObjectURL(removed.preview);
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

            {f.status === 'failed' && (
              <div className="absolute inset-0 bg-red-900/70 text-white flex flex-col items-center justify-center text-xs gap-2">
                <span>آپلود ناموفق</span>
                <button
                  type="button"
                  onClick={() => retry(f)}
                  className="bg-white text-red-700 rounded px-2 py-1">
                  تلاش دوباره
                </button>
              </div>
            )}

            <button
              type="button"
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
