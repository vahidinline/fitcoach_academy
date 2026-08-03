import { useState, useEffect } from 'react';
import api from 'api/api';
import BottomTabNavigation from 'components/ui/BottomTabNavigation';

// --- NEW COMPONENTS ---
import ProfilePage from './Components/ProfilePage';
import AssessmentWizard from './Components/AssessmentWizard';
import ContextualHeader from 'components/ui/ContextualHeader';

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
    <div className="academy-shell academy-grain">
      <ContextualHeader />
      <main className="academy-page relative z-10" dir="rtl">
        <div className="mb-7">
          <p className="academy-kicker">حساب و ارزیابی</p>
          <h2 className="academy-title mt-2">پروفایل من</h2>
          <p className="mt-3 text-sm leading-7 text-[#68716d]">اطلاعات پایه و ارزیابی بدنی خود را کامل و به‌روز نگه دار.</p>
        </div>
        <div className="academy-surface mx-auto max-w-3xl p-4 sm:p-7">
        {/* ---- TABS ---- */}
        <div className="mb-7 grid grid-cols-2 rounded-2xl bg-[#eae6dc] p-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`min-h-11 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'profile'
                ? 'bg-[#1c2c29] text-white shadow-lg'
                : 'text-[#68716d]'
            }`}>
            اطلاعات شخصی
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('assessment')}
            className={`min-h-11 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'assessment'
                ? 'bg-[#1c2c29] text-white shadow-lg'
                : 'text-[#68716d]'
            }`}>
            ارزیابی اولیه
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
      </main>

      <BottomTabNavigation />
    </div>
  );
}
