import React, { useEffect, useState } from 'react';
import api from 'api/api';

export default function UserAttachments({ userId }) {
  const [list, setList] = useState([]);

  const load = async () => {
    const res = await api.get(`/report/attachments?userId=${userId}`);
    setList(res.data.attachments);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-4 bg-white rounded-xl shadow mt-6">
      <h3 className="font-bold mb-2">فایل‌های ارسال‌شده</h3>

      {list.map((a) => (
        <div key={a._id} className="border-b py-2">
          <p>
            نوع:{' '}
            {a.type === 'body-analysis' ? 'بادی آنالیز' : 'آزمایش (Lab Test)'}
          </p>
          <a href={a.fileUrl} className="text-blue-600" target="_blank">
            مشاهده فایل
          </a>
        </div>
      ))}
    </div>
  );
}
