import React, { useState } from 'react';
import api from 'api/api';

export default function LabTestUpload({ userId }) {
  const [file, setFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const upload = async () => {
    if (!file) return alert('ابتدا فایل را انتخاب کنید');

    if (file.size > 10 * 1024 * 1024) return setError('حداکثر حجم فایل ۱۰ مگابایت است.');
    setUploading(true);
    setError('');
    const form = new FormData();
    form.append('file', file);
    form.append('userId', userId);

    try {
      const res = await api.post('/report/upload-lab-test', form);
      setUploadedUrl(res.data.attachment.fileUrl);
    } catch (err) {
      setError(err.response?.data?.error || 'آپلود ناموفق بود؛ دوباره تلاش کنید.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h3 className="font-bold mb-2">آپلود آزمایش</h3>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button
        disabled={uploading}
        className="bg-green-600 text-white p-2 rounded mt-3"
        onClick={upload}>
        {uploading ? 'در حال آپلود...' : 'آپلود'}
      </button>

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

      {uploadedUrl && (
        <a
          href={uploadedUrl}
          target="_blank"
          rel="noreferrer"
          className="block text-blue-600 mt-3">
          مشاهده فایل
        </a>
      )}
    </div>
  );
}
