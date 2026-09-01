import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';

import ContextualHeader from '../../components/ui/ContextualHeader';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import VideoPlayer from './components/VideoPlayer';
import VideoDetails from './components/VideoDetails';
import VideoRecommendations from './components/VideoRecommendations';
import CommentsSection from './components/CommentsSection';
import ProgressTracker from './components/ProgressTracker';

// ایمپورت تصاویر برای دیتای هاردکد شده
import Thumb01 from '../../assets/img/video01.jpg';
import Thumb02 from '../../assets/img/video02.jpg';
import Thumb03 from '../../assets/img/video03.jpg';
import Thumb04 from '../../assets/img/video04.jpg';
import Thumb05 from '../../assets/img/video05.jpg';
import Thumb06 from '../../assets/img/video06.jpg';
import Thumb07 from '../../assets/img/video07.jpg';
import Thumb08 from '../../assets/img/video08.jpg';
import Thumb09 from '../../assets/img/video09.jpg';
import Thumb10 from '../../assets/img/video10.jpg';
import ThumbDefault from '../../assets/img/video02.jpg';

const TrainingVideoPlayer = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const [currentVideo, setCurrentVideo] = useState(null);
  const [allVideos, setAllVideos] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  // ----------------------------------------------------------------
  // 1. دیتای هاردکد شده برای کاربران ACADEMY
  // ----------------------------------------------------------------
  const mockVideosAcademy = [
    {
      id: '1',
      title: 'جلسه اول آکادمی',
      description: `توضیحات درباره روند کار در مسیر تناسب اندام`,
      videoSrc: 'https://dl.azishafiei.ir/shape-up-academy/session-01-65c7c01c56331d31b7a495bd.mp4',
      thumbnail: Thumb01,
      duration: 49,
      instructor: 'آذر شفیعی',
      rating: 4.8,
      totalRatings: 1247,
      sessionNumber: 1,
      attachments: [
        { url: 'https://backend.fitlinez.com/uploads/session05.jpg' },
        { url: 'https://backend.fitlinez.com/all/weight%20gain.webp' },
      ],
      additionalLinks: [],
    },
    {
      id: '2',
      title: 'جلسه دوم',
      description: `همه چیز درباره پروتیین`,
      videoSrc: 'https://dl.azishafiei.ir/shape-up-academy/session-02-65d25131a9f0a79c2a044586.mp4',
      thumbnail: Thumb02,
      duration: 35,
      instructor: 'آذر شفیعی',
      rating: 4.6,
      totalRatings: 892,
      sessionNumber: 2,
      attachments: [
        {
          description: 'هرم پروتیین',
          url: 'https://backend.fitlinez.com/uploads/protein01.jpg',
        },
        {
          description: 'منابع پروتیین',
          url: 'https://backend.fitlinez.com/uploads/protein02.jpg',
        },
      ],
    },
    {
      id: '3',
      title: 'جلسه سوم',
      description: `همه چیز درباره فیبر`,
      videoSrc: 'https://dl.azishafiei.ir/shape-up-academy/session-03-65d2506ba9f0a79c2a044585.mp4',
      thumbnail: Thumb03,
      duration: 40,
      instructor: 'آذر شفیعی',
      rating: 4.9,
      totalRatings: 1563,
      sessionNumber: 3,
      attachments: [
        {
          url: 'https://backend.fitlinez.com/uploads/fiber.jpg',
          description: 'فایل فیبر',
        },
      ],
    },
    {
      id: '4',
      title: 'جلسه چهارم',
      description: `همه چیز درباره کربوهیدرات و قندها`,
      videoSrc: 'https://dl.azishafiei.ir/shape-up-academy/session-04-65dc5ff4ea6c6fcb2b681af3.mp4',
      thumbnail: Thumb04,
      duration: 42,
      instructor: 'آذر شفیعی',
      rating: 4.9,
      totalRatings: 1563,
      sessionNumber: 4,
      attachments: [
        {
          description: 'منابع کربوهیدرات',
          url: 'https://backend.fitlinez.com/uploads/401.jpg',
        },
        {
          description: 'دسته بندی کربوهیدرات ساده و پیچیده',
          url: 'https://backend.fitlinez.com/uploads/402.jpg',
        },
      ],
    },
    {
      id: '5',
      title: 'جلسه پنجم',
      description: `همه چیز درباره خواب و آب`,
      videoSrc: 'https://dl.azishafiei.ir/shape-up-academy/session-05-65d251a5a9f0a79c2a044587.mp4',
      thumbnail: Thumb05,
      duration: 58,
      instructor: 'آذر شفیعی',
      rating: 4.9,
      totalRatings: 1563,
      sessionNumber: 5,
      attachments: [
        {
          description: 'بهداشت خواب',
          url: 'https://backend.fitlinez.com/uploads/sleep01.png',
        },
        {
          description: 'عوارض بی خوابی',
          url: 'https://backend.fitlinez.com/uploads/sleep02.webp',
        },
      ],
    },
    {
      id: '6',
      title: 'جلسه ششم',
      description: `همه چیز درباره چربی ها`,
      videoSrc: 'https://dl.azishafiei.ir/shape-up-academy/session-06-65dc703eea6c6fcb2b681af5.mp4',
      thumbnail: Thumb06,
      duration: 42,
      instructor: 'آذر شفیعی',
      rating: 4.9,
      totalRatings: 1563,
      sessionNumber: 6,
      attachments: [
        {
          description: 'منابع چربی',
          url: 'https://backend.fitlinez.com/uploads/fat01.jpg',
        },
      ],
    },
    {
      id: '7',
      title: 'جلسه هفتم',
      description: `سبزیجات و hand size portion`,
      videoSrc: 'https://dl.azishafiei.ir/shape-up-academy/session-07-65dc714bea6c6fcb2b681af6.mp4',
      thumbnail: Thumb07,
      duration: 29,
      instructor: 'آذر شفیعی',
      rating: 4.9,
      totalRatings: 1563,
      sessionNumber: 7,
      attachments: [
        {
          description: 'منابع سبزیجات',
          url: 'https://backend.fitlinez.com/uploads/vegetables01.jpg',
        },
      ],
      additionalLinks: [
        { link: 'https://t.me/+N-EXtwJ6_UdlYWJk', name: 'لینک گروه تلگرام' },
      ],
    },
    {
      id: '8',
      title: 'جلسه هشتم',
      description: `بررسی و مقایسه انواع رژیم های روز دنیا`,
      videoSrc: 'https://dl.azishafiei.ir/shape-up-academy/session-08-65dc71aaea6c6fcb2b681af7.mp4',
      thumbnail: Thumb08,
      duration: 51,
      instructor: 'آذر شفیعی',
      rating: 4.9,
      totalRatings: 1563,
      sessionNumber: 8,
    },
    {
      id: '9',
      title: 'جلسه نهم',
      description: `همه چیز درباره مکمل های ضروری و غیر ضروری`,
      videoSrc: 'https://dl.azishafiei.ir/shape-up-academy/session-09-65dc71f6ea6c6fcb2b681af8.mp4',
      thumbnail: Thumb09,
      duration: 35,
      instructor: 'آذر شفیعی',
      rating: 4.9,
      totalRatings: 1563,
      sessionNumber: 9,
    },
    {
      id: '10',
      title: 'جلسه دهم',
      description: `جمع بندی مطالب، مثال عینی طراحی یک برنامه ی غذایی`,
      videoSrc: 'https://dl.azishafiei.ir/shape-up-academy/session-10-664716c3d9892a21a4e4b244.mp4',
      thumbnail: Thumb10,
      duration: 53,
      instructor: 'آذر شفیعی',
      rating: 4.9,
      totalRatings: 1563,
      sessionNumber: 10,
    },
    {
      id: '11',
      title: 'قسمت دوم -  جلسه دهم',
      description: `جمع بندی مطالب، مثال عینی طراحی یک برنامه ی غذایی محاسبه کالری و چینش درصد ماکرویی ⁠هرم های تغذیه، پروتیین و کالری خروجی ⁠و منحنی یادگیری`,
      videoSrc:
        'https://dl.azishafiei.ir/shape-up-academy/session-11-65f30492309433588fa32b98.mp4',
      thumbnail: Thumb10,
      duration: 28,
      // difficulty: 'Beginner',
      instructor: 'آذر شفیعی',
      //equipment: ['Yoga Mat'],
      rating: 4.9,
      totalRatings: 1563,
      //category: 'Core',
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setAccessDenied(false);

      try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userId = userData.id;

        if (!userId) {
          navigate('/login');
          return;
        }

        // دریافت نوع اشتراک
        const subRes = await api.get(`/subscription/active/${userId}`);
        const userProductType = subRes.data?.subscription?.productType;
        const canWatchVideos = subRes.data?.subscription?.offlineVideoAccess;

        if (!userProductType || !canWatchVideos) {
          setAccessDenied(true);
          setIsLoading(false);
          return;
        }

        const type = userProductType.toLowerCase().trim();
        let videosToDisplay = [];

        // ----------------------------------------------------------------
        // 2. منطق دو شاخه: Academy (هاردکد) و Pro (دیتابیس)
        // ----------------------------------------------------------------

        if (type.includes('academy')) {
          // >>> حالت اول: کاربر آکادمی است -> استفاده از دیتای هاردکد شده
          console.log('User is Academy -> Loading Mock Data');
          videosToDisplay = mockVideosAcademy;
        } else if (type.includes('pro')) {
          // >>> حالت دوم: کاربر پرو است -> درخواست به دیتابیس
          console.log('User is Pro -> Fetching from DB (Shape up pro 9)');

          const targetProductName = 'Shape up pro 9';

          // درخواست به سرور
          const videosRes = await api.get('/sessionvideo', {
            params: { product: targetProductName },
          });

          const rawVideos = videosRes.data;

          if (rawVideos && rawVideos.length > 0) {
            // تبدیل فرمت دیتابیس به فرمت استاندارد کامپوننت
            videosToDisplay = rawVideos.map((v, index) => ({
              id: v._id,
              title: v.name,
              description: v.description || '',
              videoSrc: v.link, // احتمالا لینک گوگل درایو
              thumbnail: index === 0 ? Thumb01 : ThumbDefault,
              duration: v.duration ? parseInt(v.duration) : 0,
              difficulty: 'All Levels',
              instructor: 'آذر شفیعی',
              rating: 4.8,
              totalRatings: 150 + index,
              sessionNumber: v.session,
              attachments: v.attachments || [],
              additionalLinks: v.additionalLinks || [],
              category: targetProductName,
            }));

            // مرتب‌سازی بر اساس جلسه
            videosToDisplay.sort((a, b) => a.sessionNumber - b.sessionNumber);
          }
        } else {
          // اشتراک نامعتبر
          setAccessDenied(true);
          setIsLoading(false);
          return;
        }

        // ----------------------------------------------------------------
        // 3. تنظیم استیت نهایی (مشترک بین هر دو حالت)
        // ----------------------------------------------------------------
        setAllVideos(videosToDisplay);

        // پیدا کردن ویدیو برای پخش
        const selectedVideo = videoId
          ? videosToDisplay.find((v) => v.id === videoId)
          : videosToDisplay[0];

        if (selectedVideo) {
          setCurrentVideo(selectedVideo);
          const bookmarked = localStorage.getItem(
            `bookmark_${selectedVideo.id}`
          );
          setIsBookmarked(bookmarked === 'true');
          const rating = localStorage.getItem(`rating_${selectedVideo.id}`);
          setUserRating(rating ? parseInt(rating) : 0);
        }
      } catch (error) {
        console.error('Error in fetching flow:', error);
        if (
          error.response &&
          (error.response.status === 403 || error.response.status === 401)
        ) {
          setAccessDenied(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [videoId, navigate]);

  // --- توابع هندلر (بدون تغییر) ---
  const handleVideoProgress = (currentTime, duration) => {};
  const handleVideoComplete = () => {};

  const handleBookmark = () => {
    if (!currentVideo) return;
    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);
    localStorage.setItem(
      `bookmark_${currentVideo.id}`,
      newBookmarkState.toString()
    );
  };

  const handleRating = (rating) => {
    if (!currentVideo) return;
    setUserRating(rating);
    localStorage.setItem(`rating_${currentVideo.id}`, rating.toString());
  };

  const handleAddComment = (content) => {
    // لاجیک کامنت
  };
  const handleLikeComment = (commentId) => {
    // لاجیک لایک
  };

  const handleVideoSelect = (video) => {
    navigate(`/training-video-player/${video.id}`);
  };

  // --- توابع Helper ---
  const getNextVideo = () => {
    if (!currentVideo || allVideos.length === 0) return null;
    const currentIndex = allVideos.findIndex((v) => v.id === currentVideo.id);
    return currentIndex < allVideos.length - 1
      ? allVideos[currentIndex + 1]
      : null;
  };

  const getRelatedVideos = () => {
    if (!currentVideo) return [];
    return allVideos.filter((v) => v.id !== currentVideo.id).slice(0, 3);
  };

  const getSeriesVideos = () => {
    if (!currentVideo) return [];
    const currentIndex = allVideos.findIndex((v) => v.id === currentVideo.id);
    return allVideos.map((video, index) => ({
      ...video,
      completed: index < currentIndex,
      current: video.id === currentVideo.id,
    }));
  };

  // تشخیص لینک گوگل درایو (برای پرو)
  const isGoogleDriveLink = (url) => {
    return (
      url &&
      (url.includes('drive.google.com') || url.includes('docs.google.com'))
    );
  };

  // --- رندر ---
  if (isLoading) return <LoadingView />;
  if (accessDenied) return <AccessDeniedView />;
  if (!currentVideo) return <NoVideoView />;

  return (
    <div className="academy-shell academy-grain">
      <ContextualHeader />

      <main className="academy-page relative z-10" dir="rtl">
        <div className="mb-6">
          <p className="academy-kicker">کتابخانه آموزشی</p>
          <h2 className="academy-title mt-2">یادگیری را از همان‌جا ادامه بده</h2>
        </div>
        <div className="gap-5 lg:flex">
          <div className="lg:flex-1 lg:max-w-4xl">
            {/* پلیر ویدیو */}
            <div className="relative z-0 aspect-video overflow-hidden rounded-[1.5rem] bg-black shadow-[0_24px_60px_rgba(28,44,41,.18)]">
              {/* اگر لینک گوگل درایو بود (کاربر پرو) -> Iframe */}
              {isGoogleDriveLink(currentVideo.videoSrc) ? (
                <iframe
                  src={currentVideo.videoSrc.replace('/view', '/preview')}
                  className="w-full h-full border-none"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                  title={currentVideo.title}
                />
              ) : (
                /* اگر لینک مستقیم MP4 بود (کاربر آکادمی) -> VideoPlayer */
                <VideoPlayer
                  videoSrc={currentVideo.videoSrc}
                  title={currentVideo.title}
                  onProgress={handleVideoProgress}
                  onComplete={handleVideoComplete}
                  className="w-full h-full"
                  thumbnail={currentVideo.thumbnail}
                />
              )}
            </div>

            <div className="academy-surface mt-4 p-4 lg:hidden">
              <VideoDetails
                title={currentVideo.title}
                description={currentVideo.description}
                difficulty={currentVideo.difficulty}
                duration={currentVideo.duration}
                equipment={currentVideo.equipment}
                instructor={currentVideo.instructor}
                rating={currentVideo.rating}
                totalRatings={currentVideo.totalRatings}
                isBookmarked={isBookmarked}
                onBookmark={handleBookmark}
                onRate={handleRating}
                userRating={userRating}
                attachments={currentVideo.attachments}
              />
            </div>

            <div className="academy-surface mt-4 p-4 lg:hidden">
              <CommentsSection
                comments={comments}
                onAddComment={handleAddComment}
                onLikeComment={handleLikeComment}
              />
            </div>
          </div>

          <div className="hidden lg:block lg:w-80 lg:space-y-5">
            <VideoDetails
              title={currentVideo.title}
              description={currentVideo.description}
              difficulty={currentVideo.difficulty}
              duration={currentVideo.duration}
              equipment={currentVideo.equipment}
              instructor={currentVideo.instructor}
              rating={currentVideo.rating}
              totalRatings={currentVideo.totalRatings}
              isBookmarked={isBookmarked}
              onBookmark={handleBookmark}
              onRate={handleRating}
              userRating={userRating}
              attachments={currentVideo.attachments}
            />

            <VideoRecommendations
              nextVideo={getNextVideo()}
              relatedVideos={getRelatedVideos()}
              seriesVideos={getSeriesVideos()}
              onVideoSelect={handleVideoSelect}
            />
          </div>
        </div>

        <div className="lg:hidden space-y-4 p-4">
          <ProgressTracker
            videoId={currentVideo.id}
            totalDuration={currentVideo.duration * 60}
          />
          <VideoRecommendations
            nextVideo={getNextVideo()}
            relatedVideos={getRelatedVideos()}
            seriesVideos={getSeriesVideos()}
            onVideoSelect={handleVideoSelect}
          />
        </div>
      </main>

      <BottomTabNavigation />
    </div>
  );
};

// UI های کمکی
const LoadingView = () => (
  <div className="min-h-screen bg-background pt-20 flex justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-muted-foreground">در حال بارگذاری...</p>
    </div>
  </div>
);

const AccessDeniedView = () => (
  <div className="min-h-screen bg-background pt-20 flex justify-center">
    <div className="text-center p-6 bg-red-50 rounded-lg border border-red-100">
      <p className="text-red-600 font-bold">عدم دسترسی</p>
      <p>شما اشتراک فعال برای مشاهده این محتوا را ندارید.</p>
    </div>
    <BottomTabNavigation />
  </div>
);

const NoVideoView = () => (
  <div className="min-h-screen bg-background pt-20 flex justify-center">
    <p>ویدیویی یافت نشد.</p>
    <BottomTabNavigation />
  </div>
);

export default TrainingVideoPlayer;
