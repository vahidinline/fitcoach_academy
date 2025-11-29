import { useState, useEffect } from 'react';
import api from 'api/api';
import BottomTabNavigation from 'components/ui/BottomTabNavigation';

// --- NEW COMPONENTS ---
import ProfilePage from './Components/ProfilePage';
import AssessmentWizard from './Components/AssessmentWizard';

export default function BasicForm() {
  const storedUserData = (() => {
    try {
      return JSON.parse(localStorage.getItem('userData') || 'null');
    } catch {
      return null;
    }
  })();

  const userId = storedUserData?.id || storedUserData?.userId || '';

  const [activeTab, setActiveTab] = useState('assessment'); // profile | assessment

  // ---- PROFILE DATA ----
  const [profileData, setProfileData] = useState({
    userId,
    name: storedUserData?.name || '',
    email: '',
    phoneNumber: '',
    location: '',
    instagram: '',
    photo: '',
  });

  const [profileExists, setProfileExists] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const loadProfile = async () => {
      try {
        const res = await api.get(`/api/client/${userId}`);
        if (res.data?.data) {
          setProfileData((prev) => ({ ...prev, ...res.data.data }));
          setProfileExists(true);
        }
      } catch (err) {
        console.log('Profile not found yet');
      }
      setProfileLoading(false);
    };

    loadProfile();
  }, [userId]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto pt-20 p-4 bg-white rounded-lg shadow-md font-custom1">
        {/* ---- TABS ---- */}
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

        {/* ---- ACTIVE TAB ---- */}
        {activeTab === 'profile' ? (
          <ProfilePage
            profileData={profileData}
            setProfileData={setProfileData}
            loading={profileLoading}
            exists={profileExists}
          />
        ) : (
          <AssessmentWizard />
        )}
      </div>

      <BottomTabNavigation />
    </div>
  );
}
