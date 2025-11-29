import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/ui/AuthenticationGuard';
import ContextualHeader from '../../components/ui/ContextualHeader';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import UserStatusCard from './components/UserStatusCard';
import StatsCards from './components/StatsCards';
import TrainingVideoGrid from './components/TrainingVideoGrid';
import ProgressSection from './components/ProgressSection';
import QuickActions from './components/QuickActions';
import UpcomingSchedule from './components/UpcomingSchedule';
import FloatingActionButton from './components/FloatingActionButton';
import { t } from '../../utils/translations';
import SubscriptionStatus from 'components/SubscriptionStatus';
import NotificationBell from 'components/notifications/NotificationBell';

const UserDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const userId = JSON.parse(localStorage.getItem('userData')).id;

  const trainingVideos = [
    {
      id: 1,
      title: 'آموزش اپلیکیشن MyFitnessPal',
      thumbnail:
        'https://drupal.iconagency.com.au/files/agency/styles/large/public/2023-04/Mobile_screens.png',
      duration: 1800, // 30 minutes
      difficulty: t('dashboard.beginner'),
      views: 1250,
      progress: 75,
      completed: false,
    },
    {
      id: 2,
      title: 'آموزش Hand Size Portion',
      thumbnail:
        'https://cdn.shopify.com/s/files/1/0741/7019/files/fullplate_handportionsize.jpg',
      duration: 1200, // 20 minutes
      difficulty: t('dashboard.intermediate'),
      views: 890,
      progress: 100,
      completed: true,
    },
  ];

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      try {
        // Mock API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock dashboard data with Persian content

        const mockData = {
          user: {
            ...user,
          },
          stats: {
            initWeight: 88 || 0,
            goalWeight: 55,
            daysOfDiet: 30,
            nextMilestone: 'کاهش سایز',
          },

          progressReports: [
            {
              id: 'PR001',
              submittedAt: '2025-01-28T10:30:00Z',
              status: 'reviewed',
              beforePhoto:
                'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
              afterPhoto:
                'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop',
              coachFeedback:
                'پیشرفت عالی! فرم شما به طور قابل توجهی بهبود یافته است. به تمرکز بر ثبات و تغذیه مناسب ادامه دهید.',
            },
            {
              id: 'PR002',
              submittedAt: '2025-01-25T14:15:00Z',
              status: 'pending',
              beforePhoto:
                'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?w=200&h=200&fit=crop',
              afterPhoto: null,
              coachFeedback: null,
            },
            {
              id: 'PR003',
              submittedAt: '2025-01-22T09:45:00Z',
              status: 'needs_revision',
              beforePhoto: null,
              afterPhoto:
                'https://images.pixabay.com/photo/2017/08/07/14/02/people-2604149_1280.jpg?w=200&h=200&fit=crop',
              coachFeedback:
                'لطفاً هر دو عکس قبل و بعد را برای مقایسه بهتر قرار دهید. همچنین جزئیات بیشتری در مورد برنامه تمرینی خود اضافه کنید.',
            },
          ],
          upcomingSchedule: [
            {
              id: 1,
              title: 'تمرین قدرتی تمام بدن',
              description: 'تمرکز بر حرکات ترکیبی',
              time: '09:00',
              type: 'workout',
              completed: false,
            },
            {
              id: 2,
              title: 'چک‌اپ تغذیه',
              description: 'بررسی برنامه غذایی با مربی',
              time: '14:30',
              type: 'nutrition',
              completed: false,
            },
            {
              id: 3,
              title: 'جلسه عکس پیشرفت',
              description: 'مستندسازی پیشرفت هفتگی',
              time: '18:00',
              type: 'check-in',
              completed: true,
            },
          ],
        };

        setDashboardData(mockData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const calculateTrialDaysRemaining = () => {
    if (!dashboardData?.user?.trialEndDate) return null;

    const endDate = new Date(dashboardData.user.trialEndDate);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background font-vazir">
        <ContextualHeader />
        <div className="pt-16 pb-20 lg:pl-64 lg:pb-6">
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-muted-foreground">
                  {t('dashboard.loadingDashboard')}
                </p>
              </div>
            </div>
          </div>
        </div>
        <BottomTabNavigation />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-background font-vazir">
        <ContextualHeader />
        <div className="pt-16 pb-20 lg:pl-64 lg:pb-6">
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  {t('dashboard.failedToLoad')}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-primary hover:text-primary/80 animate-spring">
                  {t('dashboard.tryAgain')}
                </button>
              </div>
            </div>
          </div>
        </div>
        <BottomTabNavigation />
      </div>
    );
  }

  const trialDaysRemaining = calculateTrialDaysRemaining();

  return (
    <div className="min-h-screen bg-background font-vazir">
      <ContextualHeader />

      <main dir="rtl" className="pt-16 pb-20 lg:pl-64 lg:pb-6">
        <div className="p-4 lg:p-6 space-y-6">
          {/* User Status Card */}
          <UserStatusCard userId={userId} />

          <SubscriptionStatus userId={userId} />

          <TrainingVideoGrid videos={trainingVideos} />
        </div>
      </main>

      <BottomTabNavigation />
    </div>
  );
};

export default UserDashboard;
