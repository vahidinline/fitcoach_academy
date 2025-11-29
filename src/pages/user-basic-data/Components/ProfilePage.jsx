import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import api from 'api/api';

export default function ProfilePage() {
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = user.id;

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    instagram: '',
    location: '',
    photo: '',
  });

  const [loading, setLoading] = useState(false);

  // ===== GSAP Animation =====
  useEffect(() => {
    if (containerRef.current) {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 25,
        duration: 0.6,
        ease: 'power3.out',
      });
    }
  }, []);

  // ===== Load Existing Profile =====
  const loadProfile = async () => {
    try {
      const res = await api.get(`/api/client/${userId}`);
      setProfile((p) => ({ ...p, ...res.data }));
    } catch (err) {
      console.warn('Profile not found yet.');
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // ===== Upload Image (same as PhotoUploadSection) =====
  const uploadPhoto = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/report/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return res.data.url; // URL returned by backend
    } catch (err) {
      console.error('Upload failed:', err);
      alert('آپلود عکس ناموفق بود.');
      return null;
    }
  };

  // ===== Handle Image Selection =====
  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadPhoto(file);
    if (!url) return;

    setProfile((prev) => ({ ...prev, photo: url }));
  };

  // ===== Save Profile =====
  const saveProfile = async () => {
    setLoading(true);
    try {
      await api.put(`/api/client/${userId}`, profile);

      gsap.to(containerRef.current, {
        backgroundColor: '#e6ffe6',
        duration: 0.3,
        yoyo: true,
        repeat: 1,
      });

      alert('پروفایل با موفقیت ذخیره شد');
    } catch (err) {
      console.error(err);
      alert('خطا در ذخیره پروفایل');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="p-4 max-w-lg mx-auto space-y-6">
      <h2 className="text-xl font-bold text-center">پروفایل کاربر</h2>

      {/* Avatar */}
      <div className="flex justify-center">
        <div
          className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden shadow cursor-pointer"
          onClick={() => fileInputRef.current?.click()}>
          {profile.photo ? (
            <img src={profile.photo} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              بدون عکس
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handlePhotoChange}
        />
      </div>

      {/* Name */}
      <input
        className="input"
        placeholder="نام"
        value={profile.name}
        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
      />

      {/* Email */}
      <input
        className="input"
        placeholder="ایمیل"
        value={profile.email}
        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
      />

      {/* Phone */}
      <input
        className="input"
        placeholder="شماره موبایل"
        value={profile.phoneNumber}
        onChange={(e) =>
          setProfile({ ...profile, phoneNumber: e.target.value })
        }
      />

      {/* Instagram */}
      <input
        className="input"
        placeholder="اینستاگرام"
        value={profile.instagram}
        onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
      />

      {/* Location */}
      <input
        className="input"
        placeholder="موقعیت"
        value={profile.location}
        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
      />

      {/* Save button */}
      <button
        onClick={saveProfile}
        disabled={loading}
        className="btn-primary w-full py-3">
        {loading ? 'در حال ذخیره...' : 'ذخیره پروفایل'}
      </button>
    </div>
  );
}
