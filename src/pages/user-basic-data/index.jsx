import api from 'api/api';
import BottomTabNavigation from 'components/ui/BottomTabNavigation';

import Input from 'components/ui/Input';
import Select from 'components/ui/Select';
import { useEffect, useState, useRef } from 'react';
import AssessmentForm from './Components/AssessmentForm';

export default function BasicForm() {
  const storedCredentials = (() => {
    try {
      return JSON.parse(localStorage.getItem('credentials') || 'null');
    } catch {
      return null;
    }
  })();
  const storedUserData = (() => {
    try {
      return JSON.parse(localStorage.getItem('userData') || 'null');
    } catch {
      return null;
    }
  })();

  const initialUserId =
    storedCredentials?.userId ||
    storedUserData?.id ||
    storedUserData?.userId ||
    '';

  const initialName = storedUserData?.name || '';
  console.log('Initial User ID:', initialUserId);
  console.log('Initial Name:', initialName);

  // --- NEW: Tab management ---
  const [activeTab, setActiveTab] = useState('assessment'); // 'assessment' | 'profile'

  // --- Existing assessment states ---
  const [status, setStatus] = useState('idle');
  const [editMode, setEditMode] = useState(false);
  const [docExists, setDocExists] = useState(false);
  const hiddenFields = ['userId', '__v', 'createdAt', 'id', '_id', 'updatedAt'];

  const [userData, setUserData] = useState({
    userId: initialUserId || '',
    weight: '',
    height: '',
    age: '',
    gender: '',
    illness: '',
    medication: '',
    pain: '',
    reason: '',
    calorie: '',
    calories: '',
    macro: '',
    lastTimeDiet: '',
    currentDiet: '',
    exerciseType: '',
    placeOfExercise: '',
    comment: '',
    updatedAt: '',
  });

  // --- NEW: User profile states ---
  const [profileData, setProfileData] = useState({
    userId: initialUserId || '',
    name: initialName || '',
    email: '',
    phone: '',
    location: '',
    instagram: '',
    photo: '',
  });
  const [profileExists, setProfileExists] = useState(false);
  const [profileStatus, setProfileStatus] = useState('idle');
  const [profileEditMode, setProfileEditMode] = useState(false);

  const formRef = useRef(null);

  const fieldLabels = {
    name: 'نام',
    email: 'ایمیل',
    phone: 'شماره تماس',
    photo: 'عکس پروفایل',
    location: 'موقعیت مکانی',
    instagram: 'آیدی اینستاگرام',
    weight: 'وزن فعلی (کیلوگرم)',
    height: 'قد (سانتی‌متر)',
    age: 'سن',
    gender: 'جنسیت',
    illness: 'بیماری خاص',
    medication: 'داروی خاص',
    pain: 'محل درد',
    reason: 'دلیل شرکت در دوره',
    calorie: 'آشنایی با کالری',
    calories: 'میزان کالری مصرفی',
    macro: 'آشنایی با ماکرو',
    lastTimeDiet: 'آخرین رژیم',
    currentDiet: 'رژیم فعلی',
    exerciseType: 'نوع ورزش',
    placeOfExercise: 'محل ورزش',
    comment: 'توضیحات',
    updatedAt: 'آخرین به‌روزرسانی',
  };

  // ======== FETCH FUNCTIONS ========

  // Existing ShapeUpAssessment
  const fetchAssessment = async (id) => {
    setStatus('loading');
    try {
      const res = await api.get(`/ShapeUpAssessment/${initialUserId}`);
      if (res.data?.data) {
        setUserData((prev) => ({ ...prev, ...res.data.data }));
        setDocExists(true);
      } else setDocExists(false);
      setStatus('loaded');
    } catch {
      setStatus('idle');
    }
  };

  // NEW: Fetch user profile
  const fetchProfile = async (id) => {
    setProfileStatus('loading');
    try {
      const res = await api.get(`api/client/${id}`);
      if (res.data?.data) {
        console.log('Fetched profile data:', res.data.data);
        setProfileData((prev) => ({ ...prev, ...res.data.data }));
        setProfileExists(true);
      } else setProfileExists(false);
      setProfileStatus('loaded');
    } catch {
      setProfileStatus('idle');
    }
  };

  // Initial load
  useEffect(() => {
    fetchAssessment(initialUserId);
    fetchProfile(initialUserId);
  }, []);

  // ======== HANDLERS ========
  const handleChange = (e) => {
    const { id, name, value } = e.target;
    if (activeTab === 'assessment') {
      setUserData((prev) => ({ ...prev, [id || name]: value }));
    } else {
      setProfileData((prev) => ({ ...prev, [id || name]: value }));
    }
  };

  const handleSubmitAssessment = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const docId = userData._id || userData.id;
      if (docId) await api.put(`/ShapeUpAssessment/${docId}`, userData);
      else await api.post(`/ShapeUpAssessment`, userData);
      await fetchAssessment(userData.userId);
      setStatus('success');
      alert('اطلاعات با موفقیت ثبت شد');
      setEditMode(false);
    } catch {
      setStatus('error');
      alert('خطا در ثبت اطلاعات');
    }
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setProfileStatus('loading');
    try {
      console.log('Submitting profile data:', profileData.userId);
      await api.put(`/api/client/${profileData.userId}`, profileData);

      await fetchProfile(profileData.userId);
      setProfileStatus('success');
      alert('پروفایل با موفقیت به‌روزرسانی شد');
      setProfileEditMode(false);
    } catch {
      setProfileStatus('error');
      alert('خطا در به‌روزرسانی پروفایل');
    }
  };

  // ======== UI ========

  return (
    <div className="min-h-screen bg-background ">
      {/* <ContextualHeader /> */}
      <div className="max-w-2xl mx-auto pt-20 p-4 bg-white rounded-lg shadow-md font-custom1">
        {/* --- Tab Buttons --- */}
        <div dir="rtl" className="flex justify-center mb-6 gap-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === 'profile'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200'
            }`}>
            اطلاعات کاربر
          </button>
          <button
            onClick={() => setActiveTab('assessment')}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === 'assessment'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200'
            }`}>
            فرم ارزیابی
          </button>
        </div>

        {/* --- Conditional Tabs --- */}
        {activeTab === 'assessment' ? (
          // 🔹 Existing assessment UI (your full form)
          <AssessmentForm
            {...{
              userData,
              fieldLabels,
              handleChange,
              handleSubmitAssessment,
              hiddenFields,
              editMode,
              setEditMode,
              docExists,
              status,
              formRef,
            }}
          />
        ) : (
          // 🔹 New profile form
          <ProfileForm
            {...{
              profileData,
              fieldLabels,
              handleChange,
              handleSubmitProfile,
              profileEditMode,
              setProfileEditMode,
              profileExists,
              profileStatus,
            }}
          />
        )}
      </div>
      <BottomTabNavigation />
    </div>
  );
}

// ========== SUBCOMPONENTS ==========

// PROFILE TAB
function ProfileForm({
  profileData,
  fieldLabels,
  handleChange,
  handleSubmitProfile,
  profileEditMode,
  setProfileEditMode,
  profileExists,
  profileStatus,
}) {
  return (
    <form onSubmit={handleSubmitProfile} dir="rtl" className="space-y-4">
      <div className="flex justify-between bg-green-200 p-2 rounded">
        <h2 className="font-bold text-lg">پروفایل کاربر</h2>
        <button
          type="button"
          onClick={() => {
            if (profileEditMode) {
              document.activeElement.blur();
              const form = document.querySelector('form');
              form.requestSubmit();
            } else setProfileEditMode(true);
          }}
          disabled={profileStatus === 'loading'}
          className={`px-4 py-2 rounded ${
            profileEditMode
              ? 'bg-green-500 text-white'
              : 'bg-blue-500 text-white'
          }`}>
          {profileEditMode ? 'ثبت' : profileExists ? 'ویرایش' : 'ایجاد پروفایل'}
        </button>
      </div>

      {!profileEditMode ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
          {Object.entries(profileData)
            .filter(([key]) => !['_id', 'id', 'userId'].includes(key))
            .map(([key, value]) => (
              <div key={key} className="bg-gray-50 p-3 rounded shadow-sm">
                <span className="block font-semibold">
                  {fieldLabels[key] || key}:
                </span>
                {key === 'photo' && value ? (
                  <img
                    src={value}
                    alt="User"
                    className="w-24 h-24 rounded-full object-cover mt-1"
                  />
                ) : (
                  <span>{value || '—'}</span>
                )}
              </div>
            ))}
        </div>
      ) : (
        <>
          <Input
            label={fieldLabels.name}
            id="name"
            value={profileData.name}
            onChange={handleChange}
          />
          <Input
            label={fieldLabels.email}
            id="email"
            value={profileData.email}
            onChange={handleChange}
          />
          <Input
            label={fieldLabels.phone}
            id="phone"
            value={profileData.phone}
            onChange={handleChange}
          />
          <Input
            label={fieldLabels.location}
            id="location"
            value={profileData.location}
            onChange={handleChange}
          />
          <Input
            label={fieldLabels.instagram}
            id="instagram"
            value={profileData.instagram}
            onChange={handleChange}
          />
          <div className="flex flex-col">
            <label className="font-semibold mb-1">{fieldLabels.photo}</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) =>
                    handleChange({
                      target: { id: 'photo', value: ev.target?.result },
                    });
                  reader.readAsDataURL(file);
                }
              }}
            />
            {profileData.photo && (
              <img
                src={profileData.photo}
                alt="preview"
                className="w-24 h-24 mt-2 rounded-full object-cover"
              />
            )}
          </div>
          <button type="submit" className="hidden" />
        </>
      )}
    </form>
  );
}
