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

const ProgressReportSubmission = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('photos');
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

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

  const sections = [
    // {
    //   id: 'photos',
    //   label: 'اصاویر قبل و بعد',
    //   icon: 'Camera',
    //   description: 'آپلود تصاویر برای مقایسه پیشرفت',
    // },
    {
      id: 'measurements',
      label: 'سایزها',
      icon: 'Ruler',
      description: 'ثبت اندازه‌های بدن',
    },
    {
      id: 'weight',
      label: 'وزن',
      icon: 'Ruler',
      description: 'ثبت وزن فعلی و هدف',
    },
    // {
    //   id: 'calories',
    //   label: 'Calorie Tracking',
    //   icon: 'Smartphone',
    //   description: 'App screenshots'
    // },
    // {
    //   id: 'notes',
    //   label: 'یادداشت‌های پیشرفت',
    //   icon: 'FileText',
    //   description: 'بازخورد دقیق',
    // },
  ];

  const hasAnyData = () => {
    return (
      formData.beforeAfterPhotos.length > 0 ||
      Object.keys(formData.measurements).length > 0 ||
      formData.screenshots.length > 0 ||
      Object.values(formData.notes).some((note) => note && note.trim())
    );
  };

  const getCompletionStatus = () => {
    let completed = 0;
    let total = 4;

    if (formData.beforeAfterPhotos.length > 0) completed++;
    if (
      Object.keys(formData.measurements).filter((key) => key !== 'unitSystem')
        .length > 0
    )
      completed++;
    if (formData.screenshots.length > 0) completed++;
    if (Object.values(formData.notes).some((note) => note && note.trim()))
      completed++;

    return {
      completed,
      total,
      percentage: Math.round((completed / total) * 100),
    };
  };

  const handleSaveDraft = () => {
    localStorage.setItem(
      'progressReportDraft',
      JSON.stringify({
        ...formData,
        lastSaved: new Date().toISOString(),
      })
    );
    setIsDraftSaved(true);
    setLastSaved(new Date());
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Simulate submission process
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Clear draft after successful submission
      localStorage.removeItem('progressReportDraft');

      // Navigate to dashboard with success message
      navigate('/user-dashboard', {
        state: {
          message:
            'Progress report submitted successfully! Your coach will review it within 24-48 hours.',
          type: 'success',
        },
      });
    } catch (error) {
      console.error('Submission failed:', error);
      setIsSubmitting(false);
    }
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
            maxPhotos={6}
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
            screenshots={formData.screenshots}
            onScreenshotsChange={(screenshots) =>
              setFormData((prev) => ({ ...prev, screenshots }))
            }
          />
        );
      case 'weight':
        return (
          <WeightInputs
            measurements={formData.measurements}
            onMeasurementsChange={(measurements) =>
              setFormData((prev) => ({ ...prev, measurements }))
            }
          />
        );
      default:
        return null;
    }
  };

  const completionStatus = getCompletionStatus();

  return (
    <div className="min-h-screen bg-background">
      <ContextualHeader />

      <div className="pt-16 pb-20 lg:pl-64 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  گزارش پیشرفت
                </h1>
                <p className="text-muted-foreground">
                  سفر تناسب اندام خود را مستند کنید و بازخورد شخصی از مربی خود
                  دریافت کنید
                </p>
              </div>

              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                {isDraftSaved && lastSaved && (
                  <div className="flex items-center space-x-2 text-xs text-success">
                    <Icon name="Check" size={14} />
                    <span>Saved {lastSaved.toLocaleTimeString()}</span>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveDraft}
                  iconName="Save"
                  iconPosition="left">
                  <span>ذخیره پیش‌نویس</span>
                </Button>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-card-foreground">
                  {completionStatus.percentage}% تکمیل
                </span>
                <span className="text-sm text-muted-foreground">
                  {completionStatus.completed}/{completionStatus.total} بخش
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionStatus.percentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {completionStatus.percentage}% complete •
                {completionStatus.completed === completionStatus.total
                  ? ' Ready to submit!'
                  : ` ${
                      completionStatus.total - completionStatus.completed
                    } sections remaining`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Section Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-4 sticky top-24">
                <h3 className="text-sm font-medium text-card-foreground mb-4">
                  بخش‌های گزارش پیشرفت
                </h3>
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const hasData =
                      (section.id === 'photos' &&
                        formData.beforeAfterPhotos.length > 0) ||
                      (section.id === 'measurements' &&
                        Object.keys(formData.measurements).filter(
                          (key) => key !== 'unitSystem'
                        ).length > 0) ||
                      (section.id === 'calories' &&
                        formData.screenshots.length > 0) ||
                      (section.id === 'notes' &&
                        Object.values(formData.notes).some(
                          (note) => note && note.trim()
                        ));

                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left animate-spring ${
                          activeSection === section.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                        }`}>
                        <div className="relative">
                          <Icon
                            name={section.icon}
                            size={18}
                            className="text-current"
                          />
                          {hasData && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {section.label}
                          </p>
                          <p className="text-xs opacity-75 truncate">
                            {section.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-lg p-6">
                {renderActiveSection()}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
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
                  <span>پاک کردن همه داده‌ها</span>
                </Button>
              )}
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                iconName="Save"
                iconPosition="left">
                Save Draft
              </Button>

              <Button
                variant="default"
                onClick={() => setShowConfirmationModal(true)}
                disabled={!hasAnyData()}
                iconName="Send"
                iconPosition="left">
                Submit Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <BottomTabNavigation />

      {/* Confirmation Modal */}
      <SubmissionConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={handleSubmit}
        formData={formData}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default ProgressReportSubmission;
