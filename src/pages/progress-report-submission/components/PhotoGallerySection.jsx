import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import api from 'api/api';

const PhotoGallerySection = ({ userId, refreshKey }) => {
  const [groups, setGroups] = useState([]);
  const containerRef = useRef(null);

  const fetchGroups = async () => {
    try {
      const res = await api.get(`/report/photo-groups?userId=${userId}`);
      setGroups(res.data.groups || []);
    } catch (err) {
      console.error('Error loading photo groups:', err);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [refreshKey]);

  useEffect(() => {
    if (groups.length > 0) {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  }, [groups]);

  if (!groups.length)
    return <div className="rounded-[24px] border border-dashed border-[#cfd4cf] bg-[#f8f6f0] p-10 text-center"><p className="font-black text-[#1c2c29]">هنوز مجموعه عکسی ثبت نشده است</p><p className="mt-2 text-xs text-[#87928e]">مجموعه‌های قبلی پس از ثبت نهایی اینجا دیده می‌شوند.</p></div>;

  return (
    <div ref={containerRef} className="mt-8 space-y-6">
      <div><p className="academy-kicker">آرشیو تصویری</p><h4 className="mt-1 font-black text-[#1c2c29]">مجموعه‌های قبلی</h4></div>
      {groups.map((group) => (
        <div
          key={group._id}
          className="rounded-[24px] border border-[#e2ded5] bg-[#fbfaf6] p-4">
          <p className="mb-3 text-xs font-bold text-[#87928e]">
            تاریخ ثبت: {new Date(group.createdAt).toLocaleDateString('fa-IR')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {group.photos.map((url, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-[#dedad1] bg-white">
                <img
                  src={url}
                  alt={`تصویر پیشرفت ${idx + 1}`}
                  className="h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoGallerySection;
