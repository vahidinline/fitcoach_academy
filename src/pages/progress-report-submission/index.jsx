import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ContextualHeader from '../../components/ui/ContextualHeader';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import PhotoUploadSection from './components/PhotoUploadSection';
import MeasurementInputs from './components/MeasurementInputs';
import CalorieTrackingSection from './components/CalorieTrackingSection';
import ProgressNotesSection from './components/ProgressNotesSection';
import SubmissionConfirmationModal from './components/SubmissionConfirmationModal';
import WeightInputs from './components/WeightInputs';
import ReportQuota from './components/ReportQuota';
import WeightDashboard from './components/WeightDashboard';
import CoachFeedbackViewer from './components/CoachFeedbackViewer';
import { useSearchParams } from 'react-router-dom';
import LabTestUpload from './components/LabTestUpload';
import BodyAnalysisUpload from './components/BodyAnalysisUpload';
import UserAttachments from './components/UserAttachments';
import { CalendarClock, CheckCircle2, LockKeyhole } from 'lucide-react';
import { canSubmitToday } from 'utils/canSubmitReport';
import api from 'api/api';

const ProgressReportSubmission = () => {
  const navigate = useNavigate();
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const userId = JSON.parse(localStorage.getItem('userData') || '{}')?.id;
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'photos';

  const [activeSection, setActiveSection] = useState(initialTab);
  const [mondayOpen, setMondayOpen] = useState(() => canSubmitToday());
  const [weeklyReportsAccess, setWeeklyReportsAccess] = useState(true);
  const [isStartByAzi, setIsStartByAzi] = useState(false);

  useEffect(() => {
    if (!userId) return;
    api.get(`/subscription/active/${userId}`)
      .then(({ data }) => {
        setWeeklyReportsAccess(data.subscription?.weeklyReportsAccess !== false);
        setIsStartByAzi(data.subscription?.productType === 'start-by-azi');
      })
      .catch(() => { setWeeklyReportsAccess(false); setIsStartByAzi(false); });
  }, [userId]);

  useEffect(() => {
    const syncReportingWindow = () => setMondayOpen(canSubmitToday());
    const timer = window.setInterval(syncReportingWindow, 30_000);
    window.addEventListener('focus', syncReportingWindow);
    document.addEventListener('visibilitychange', syncReportingWindow);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', syncReportingWindow);
      document.removeEventListener('visibilitychange', syncReportingWindow);
    };
  }, []);

  useEffect(() => {
    if (activeSection) {
      setSearchParams({ tab: activeSection });
    }
  }, [activeSection, setSearchParams]);

  // Form data state
  const [formData, setFormData] = useState({
    beforeAfterPhotos: [],
    measurements: {},
    screenshots: [],
    notes: {
      achievements: '',
      challenges: '',
      feelings: '',
      questions: '',
    },
  });

  // Auto-save draft functionality
  useEffect(() => {
    const autoSave = () => {
      if (hasAnyData()) {
        localStorage.setItem(
          'progressReportDraft',
          JSON.stringify({
            ...formData,
            lastSaved: new Date().toISOString(),
          })
        );
        setIsDraftSaved(true);
        setLastSaved(new Date());
      }
    };

    const timer = setTimeout(autoSave, 2000);
    return () => clearTimeout(timer);
  }, [formData]);

  // Load draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('progressReportDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setFormData({
          beforeAfterPhotos: draft.beforeAfterPhotos || [],
          measurements: draft.measurements || {},
          screenshots: draft.screenshots || [],
          notes: draft.notes || {
            achievements: '',
            challenges: '',
            feelings: '',
            questions: '',
          },
        });
        setLastSaved(new Date(draft.lastSaved));
        setIsDraftSaved(true);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  const submissionSections = [
    {
      id: 'photos',
      label: 'تصاویر پیشرفت',
      icon: 'Camera',
    },
    {
      id: 'measurements',
      label: 'اندازه‌ها',
      icon: 'Ruler',
    },
    {
      id: 'calories',
      label: 'گزارش هفتگی',
      icon: 'Smartphone',
    },
  ];

  const archiveSections = [
    {
      id: 'notes',
      label: 'بازخورد مربی',
      icon: 'FileText',
    },
    {
      id: 'weight',
      label: 'روند وزن',
      icon: 'Ruler',
    },
    {
      id: 'labTest',
      label: 'آزمایش‌های پزشکی',
      icon: 'FileText',
    },
    {
      id: 'bodyAnalysis',
      label: 'بادی آنالیز',
      icon: 'FileText',
    },
    {
      id: 'attachments',
      label: 'فایل‌های ضمیمه',
      icon: 'FileText',
    },
  ];

  const hasAnyData = () => {
    return (
      formData.beforeAfterPhotos.length > 0 ||
      Object.keys(formData.measurements).length > 0 ||
      formData.screenshots.length > 0 ||
      Object.values(formData.notes).some((note) => note && note.trim())
    );
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'photos':
        return (
          <PhotoUploadSection
            title="Progress Photos"
            description="Upload before and after photos to visually track your transformation"
            photos={formData.beforeAfterPhotos}
            onPhotosChange={(photos) =>
              setFormData((prev) => ({ ...prev, beforeAfterPhotos: photos }))
            }
            maxPhotos={3}
          />
        );
      case 'measurements':
        return (
          <MeasurementInputs
            measurements={formData.measurements}
            onMeasurementsChange={(measurements) =>
              setFormData((prev) => ({ ...prev, measurements }))
            }
          />
        );
      case 'calories':
        return (
          <CalorieTrackingSection
            submissionWindowOpen={mondayOpen}
            screenshots={formData.screenshots}
            onScreenshotsChange={(screenshots) =>
              setFormData((prev) => ({ ...prev, screenshots }))
            }
          />
        );
      case 'weight':
        return <WeightDashboard />;
      case 'notes':
        return <CoachFeedbackViewer userId={userId} />;
      case 'labTest':
        return <LabTestUpload userId={userId} />;
      case 'bodyAnalysis':
        return <BodyAnalysisUpload userId={userId} />;
      case 'attachments':
        return <UserAttachments userId={userId} />;
      default:
        return null;
    }
  };

  const renderNavigationItem = (section) => {
    const isWeeklyReportLocked = section.id === 'calories' && (!mondayOpen || !weeklyReportsAccess);
    const isCoachFeedbackLocked = section.id === 'notes' && isStartByAzi;
    const isLocked = isWeeklyReportLocked || isCoachFeedbackLocked;
    const hasData =
      (section.id === 'photos' && formData.beforeAfterPhotos.length > 0) ||
      (section.id === 'measurements' &&
        Object.keys(formData.measurements).filter((key) => key !== 'unitSystem').length > 0) ||
      (section.id === 'calories' && formData.screenshots.length > 0) ||
      (section.id === 'notes' &&
        Object.values(formData.notes).some((note) => note && note.trim()));

    return (
      <button
        key={section.id}
        type="button"
        onClick={() => setActiveSection(section.id)}
        disabled={isLocked}
        aria-disabled={isLocked}
        title={isCoachFeedbackLocked ? 'بازخورد مربی در اشتراک Start by Azi فعال نیست' : isWeeklyReportLocked ? (weeklyReportsAccess ? 'ارسال گزارش هفتگی فقط دوشنبه‌ها فعال است' : 'ارسال گزارش هفتگی در اشتراک شما فعال نیست') : undefined}
        className={`flex w-full items-center gap-3 rounded-2xl p-3.5 text-right transition ${
          activeSection === section.id
            ? 'bg-[#1c2c29] text-white shadow-lg'
            : 'text-[#68716d] hover:bg-[#f3efe7] hover:text-[#18211f]'
        } ${isLocked ? 'cursor-not-allowed opacity-45' : ''}`}>
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-current/10">
          <Icon name={section.icon} size={17} className="text-current" />
          {hasData && <span className="absolute -left-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#df6b52]" />}
        </span>
        <span className="text-xs font-bold">{section.label}</span>
        {isLocked && <LockKeyhole size={14} className="mr-auto" />}
      </button>
    );
  };

  return (
    <div className="academy-shell academy-grain">
      <ContextualHeader />

      <main dir="rtl" className="academy-page relative z-10">
        <div className="mb-7">
          <p className="academy-kicker">ثبت و مرور مسیر</p>
          <h2 className="academy-title mt-2">گزارش و پیشرفت من</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#68716d]">
            گزارش هفتگی را ثبت کن و تمام تغییرات، فایل‌ها و پیام‌های مربی را در یک مسیر منظم ببین.
          </p>
        </div>

        <section className={`mb-5 flex items-start gap-4 rounded-[1.5rem] border p-4 sm:p-5 ${
          mondayOpen
            ? 'border-[#638176]/20 bg-[#dce6df]/60 text-[#29483e]'
            : 'border-[#b77a35]/20 bg-[#f2e5d2]/60 text-[#6e4c25]'
        }`}>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/60">
            {mondayOpen ? <CheckCircle2 size={21} /> : <LockKeyhole size={20} />}
          </div>
          <div>
            <h3 className="text-sm font-black">
              {weeklyReportsAccess ? (mondayOpen ? 'پنجره ارسال گزارش باز است' : 'ارسال گزارش فقط روز دوشنبه فعال می‌شود') : 'ارسال گزارش هفتگی در اشتراک شما فعال نیست'}
            </h3>
            <p className="mt-1 text-xs leading-6 opacity-75">
              {weeklyReportsAccess && mondayOpen
                ? 'تا ساعت ۲۳:۵۹ منطقه زمانی دستگاه فرصت داری گزارش این هفته را کامل کنی.'
                : weeklyReportsAccess ? 'بخش‌های آرشیو همیشه در دسترس هستند؛ برای ارسال گزارش بعدی دوشنبه برگرد.' : 'اطلاعات سلامت، وزن، فایل‌ها و بازخوردها همچنان برای شما در دسترس هستند.'}
            </p>
          </div>
          <CalendarClock size={18} className="mr-auto hidden shrink-0 sm:block" />
        </section>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[16rem_1fr]">
            {/* Section Navigation */}
            <div>
              <div className="academy-surface sticky top-24 p-3">
                <p className="px-3 pb-2 pt-1 text-[10px] font-extrabold text-[#c45843]">ارسال این هفته</p>
                <nav className="space-y-1">{submissionSections.map(renderNavigationItem)}</nav>
                <div className="my-3 h-px bg-[#1c2c29]/10" />
                <p className="px-3 pb-2 text-[10px] font-extrabold text-[#7a827e]">آرشیو مسیر</p>
                <nav className="space-y-1">
                  {archiveSections.map(renderNavigationItem)}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="min-w-0">
              <div className="academy-surface p-4 sm:p-7">
                {renderActiveSection()}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/user-dashboard')}
                iconName="ArrowLeft"
                iconPosition="left">
                بازگشت به پنل
              </Button>

              {hasAnyData() && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (
                      confirm(
                        'Are you sure you want to clear all data? This action cannot be undone.'
                      )
                    ) {
                      setFormData({
                        beforeAfterPhotos: [],
                        measurements: {},
                        screenshots: [],
                        notes: {
                          achievements: '',
                          challenges: '',
                          feelings: '',
                          questions: '',
                        },
                      });
                      localStorage.removeItem('progressReportDraft');
                      setIsDraftSaved(false);
                      setLastSaved(null);
                    }
                  }}
                  iconName="Trash2"
                  iconPosition="left"
                  className="text-destructive hover:text-destructive">
                  <span>پاک کردن پیش‌نویس</span>
                </Button>
              )}
            </div>
          </div>
      </main>

      <BottomTabNavigation />

      {/* Confirmation Modal */}
      {/* <SubmissionConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={handleSubmit}
        formData={formData}
        isSubmitting={isSubmitting}
      /> */}
    </div>
  );
};

export default ProgressReportSubmission;
