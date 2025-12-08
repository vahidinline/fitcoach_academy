import React, { useState } from 'react';
import api from 'api/api';

export default function BodyAnalysisUpload({ userId }) {
  const [file, setFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);

  const upload = async () => {
    if (!file) return alert('ابتدا فایل را انتخاب کنید');

    const form = new FormData();
    form.append('file', file);
    form.append('userId', userId);

    const res = await api.post('/report/upload-body-analysis', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    setUploadedUrl(res.data.attachment.fileUrl);
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h3 className="font-bold mb-2">آپلود بادی آنالیز</h3>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button
        className="bg-blue-600 text-white p-2 rounded mt-3"
        onClick={upload}>
        آپلود
      </button>

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
