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
    return <p className="text-gray-500 text-center">هنوز عکسی ثبت نشده است.</p>;

  return (
    <div ref={containerRef} className="space-y-6 mt-8">
      {groups.map((group) => (
        <div
          key={group._id}
          className="bg-white shadow-md rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500 mb-3">
            تاریخ ثبت: {new Date(group.createdAt).toLocaleDateString('fa-IR')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {group.photos.map((url, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-xl border border-gray-200">
                <img
                  src={url}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
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
