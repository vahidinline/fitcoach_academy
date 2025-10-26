import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ContextualHeader from '../../components/ui/ContextualHeader';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import VideoPlayer from './components/VideoPlayer';
import VideoDetails from './components/VideoDetails';
import VideoRecommendations from './components/VideoRecommendations';
import CommentsSection from './components/CommentsSection';
import ProgressTracker from './components/ProgressTracker';
import SessionQuiz from 'components/quiz';

const TrainingVideoPlayer = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock video data
  const mockVideos = [
    {
      id: '1',
      title: 'جلسه اول آکادمی ',
      description: `توضیحات درباره روند کار در مسیر تناسب اندام`,
      videoSrc: 'https://backend.fitlinez.com/private/shape_up_academy_01.mp4',
      thumbnail: '',
      duration: 49,
      //difficulty: 'Beginner',
      instructor: 'آذی شفیعی',
      // equipment: ['None - Bodyweight Only'],
      rating: 4.8,
      totalRatings: 1247,

      // category: 'HIIT',
      attachments: [
        {
          url: 'https://backend.fitlinez.com/uploads/session05.jpg',
        },
        {
          url: 'https://storage.googleapis.com/backend.fitlinez.com/all/18F8D57F-065F-4951-9C1C-F1E35F5EB24E-export.jpg',
        },
        {
          url: 'https://storage.googleapis.com/backend.fitlinez.com/all/weight%20gain.webp',
        },
      ],
      additionalLinks: [
        {
          link: 'https://play.google.com/store/apps/details?id=cc.pacer.androidapp&referrer=utm_source%3Dmypacer.com%26utm_campaign%3DWebsite%2520Referrals',
          name: 'Pacer',
          os: 'Android',
          logo: 'https://pbs.twimg.com/profile_images/956363250148433920/iuK2TGYH_400x400.jpg',
        },
        {
          name: 'Pacer',
          os: 'iOS',
          link: 'https://itunes.apple.com/app/apple-store/id600446812?mt=8',
          logo: 'https://pbs.twimg.com/profile_images/956363250148433920/iuK2TGYH_400x400.jpg',
        },
      ],
      quiz: [
        {
          question: 'کدام یک از موارد زیر در کالری خروجی وجود ندارد؟ ',
          options: ['BMR', 'کالری نقصان ', 'Neat'],
          correctAnswer: 1,
        },
        {
          question: 'میانگین قدم های یک فرد بالغ چقدر هست؟ \n',
          options: ['1000', '2000', '4000-5000', '8000-10000'],
          correctAnswer: 3,
        },
        {
          question: 'برای کاهش وزن باید در ….. باشیم \n',
          options: ['کالری تثبیت\n', 'کالری مازاد\n', 'کالری نقصان\n'],
          correctAnswer: 2,
        },
        {
          question:
            'بعد از متابولیسم پایه کدام مورد بیشترین سهم  در کالری خروجی را دارد ؟ \n',
          options: ['اثر گرمایی غذاها TEF\n', 'ورزش کردن\n', 'پیاده روی کردن'],
          correctAnswer: 2,
        },
      ],
    },
    {
      id: '2',
      title: 'جلسه دوم',
      description: `همه چیز درباره پروتیین`,
      videoSrc: 'https://backend.fitlinez.com/private/shape_up_academy_02.mp4',
      thumbnail: '',
      duration: 35,
      //difficulty: 'Intermediate',
      instructor: 'آذر شفیعی',
      //equipment: ['Dumbbells', 'Resistance Bands'],
      rating: 4.6,
      totalRatings: 892,
      //category: 'Strength',
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
      quiz: [
        {
          question: 'میزان دریافت پروتیین هر شخص بر چه اساسی مشخص می‌شود؟',
          options: ['قد شخص', 'وزن SMM شخص', 'BMI فرد', 'سن شخص'],
          correctAnswer: 1,
        },
        {
          question: 'میزان استاندارد پروتئین روزانه چقدر است؟',
          options: [
            '۱/۶ تا ۲/۲ گرم به ازای هر کیلو وزن بدن',
            'دو برابر وزن',
            'یک برابر وزن',
            '۵ گرم به ازای هر کیلو وزن بدن',
          ],
          correctAnswer: 0,
        },
        {
          question: 'کدام نوع پروتیین ارجح تر است؟',
          options: [
            'پروتئین گیاهی',
            'پروتئین حیوانی',
            'هیچ فرقی ندارد',
            'پودر پروتئین',
          ],
          correctAnswer: 1,
        },
        {
          question: 'دلیل تنوع دادن به منابع غذایی چیست؟',
          options: [
            'افزایش میروبایوم های مفید روده',
            'جلوگیری از دلزدگی و خستگی در رژیم',
            'دریافت ویتامین ها و مینرال ها از منابع مختلف',
            'همه ی موارد بالا',
          ],
          correctAnswer: 3,
        },
      ],
    },
    {
      id: '3',
      title: 'جلسه سوم',
      description: `همه چیز درباره فیبر`,
      videoSrc: 'https://backend.fitlinez.com/private/shape_up_academy_03.mp4',
      thumbnail: '',
      duration: 40,
      //difficulty: 'Beginner',
      instructor: 'آذر شفیعی',
      //equipment: ['Yoga Mat'],
      rating: 4.9,
      totalRatings: 1563,
      category: 'Core',
      attachments: [
        {
          url: 'https://backend.fitlinez.com/uploads/fiber.jpg',
          description: 'فایل فیبر',
        },
      ],
      quiz: [
        {
          question: 'کدام یک از مواد غذایی زیر منبع غنی فیبر است؟',
          options: ['نان لواش', 'برنج سفید', 'حبوبات', 'ماکارونی'],
          correctAnswer: 2,
        },
        {
          question: 'چرا مصرف بیش از حد فیبر ممکن است مضر باشد؟',
          options: [
            'کاهش وزن شدید',
            'کمبود ویتامین‌ها و مواد معدنی',
            'افزایش قند خون',
            'احساس خستگی زیاد',
          ],
          correctAnswer: 1,
        },
        {
          question:
            'مصرف فیبر کافی می‌تواند به کاهش خطر کدام یک از بیماری‌های زیر کمک کند؟',
          options: [
            'کلسترول و قند خون',
            'مشکلات قلبی',
            'نقرس',
            'فشار خون بالا',
          ],
          correctAnswer: 0,
        },
        {
          question: 'چه مقدار فیبر در روز برای یک بزرگسال توصیه می‌شود؟',
          options: [
            '10 تا 15 گرم',
            '20 تا 35 گرم',
            '40 تا 55 گرم',
            '5 تا 10 گرم',
          ],
          correctAnswer: 1,
        },
      ],
    },
    {
      id: '4',
      title: 'جلسه چهارم',
      description: `همه چیز درباره کربوهیدرات و قندها`,
      videoSrc: 'https://backend.fitlinez.com/private/shape_up_academy_04.mp4',
      thumbnail: '',
      duration: 42,
      // difficulty: 'Beginner',
      instructor: 'آذر شفیعی',
      equipment: ['Yoga Mat'],
      rating: 4.9,
      totalRatings: 1563,
      // category: 'Core',
      attachments: [
        {
          description: 'منابع کربوهیدرات',
          url: 'https://backend.fitlinez.com/uploads/401.jpg',
        },
        {
          description: 'دسته بندی کربوهیدرات ساده و پیچیده',
          url: 'https://backend.fitlinez.com/uploads/402.jpg',
        },
        {
          description: 'دسته بندی کربوهیدراتها',
          url: 'https://backend.fitlinez.com/uploads/403.webp',
        },
      ],
      quiz: [
        {
          question:
            'کدام گزینه بیانگر نقش اصلی کربوهیدرات‌های پیچیده در رژیم غذایی انسان است؟',
          options: [
            'تامین انرژی سریع',
            'تنظیم قند خون',
            'افزایش چربی بدن',
            'کاهش وزن',
          ],
          correctAnswer: 1,
        },
        {
          question:
            'کدام یک از موارد زیر بیشترین تاثیر را در کاهش قند در رژیم غذایی دارد؟',
          options: [
            'حذف تمام مواد قندی',
            'مصرف بیشتر فیبر',
            'کاهش مصرف پروتئین',
            'افزایش مصرف آب',
          ],
          correctAnswer: 1,
        },
        {
          question:
            'میزان مصرف روزانه‌ی قند (قند پنهان + free sugare) برای یک فرد بالغ سالم چقدر توصیه شده است؟',
          options: ['کمتر از 45 گرم', '50 گرم', '75 گرم', '100 گرم'],
          correctAnswer: 0,
        },
        {
          question:
            'کدام یک از موارد زیر یک منبع کربوهیدرات پیچیده است که همچنین پروتئین بالایی دارد؟',
          options: ['عسل', 'سیب', 'کینوا', 'نان سبوس‌دار'],
          correctAnswer: 2,
        },
      ],
    },
    {
      id: '5',
      title: 'جلسه پنجم',
      description: `همه چیز درباره خواب و آب`,
      videoSrc: 'https://backend.fitlinez.com/private/shape_up_academy_05.mp4',
      thumbnail: '',
      duration: 58,
      // difficulty: 'Beginner',
      instructor: 'آذر شفیعی',
      // equipment: ['Yoga Mat'],
      rating: 4.9,
      totalRatings: 1563,
      //  category: 'Core',
      attachments: [
        {
          description: 'Impactful\nSleep Hygiene Practices',
          url: 'https://backend.fitlinez.com/uploads/sleep01.png',
        },
        {
          description: 'عوارض بی خوابی',
          url: 'https://backend.fitlinez.com/uploads/sleep02.webp',
        },
        {
          description: 'بهبود خواب',
          url: 'https://backend.fitlinez.com/uploads/sleep04.jpg',
        },
        {
          url: 'https://backend.fitlinez.com/uploads/sleep%20benefits.jpeg',
          description: 'مزایای خواب',
        },
      ],
      quiz: [
        {
          question:
            'کدام یک از گزینه‌های زیر بیشترین تاثیر را بر کیفیت خواب شبانه دارد؟',
          options: [
            'مصرف کافئین قبل از خواب',
            'داشتن یک برنامه منظم خواب',
            'استفاده از گوشی موبایل در تختخواب',
            'خوردن وعده غذایی سنگین پیش از خواب',
          ],
          correctAnswer: 1,
        },
        {
          question:
            'کدام یک از موارد زیر می‌تواند به افزایش کمیت خواب کمک کند؟',
          options: [
            'نوشیدن قهوه در عصر',
            'تنظیم درجه حرارت اتاق خواب',
            'مطالعه کتاب‌های هیجان‌انگیز قبل از خواب',
            'خوابیدن در طول روز به مدت طولانی',
          ],
          correctAnswer: 1,
        },
        {
          question: 'چه مقدار آب باید یک فرد بالغ در روز بنوشد؟',
          options: [
            '2 تا 3 لیتر',
            '1 تا 2 لیتر',
            '3 تا 4 لیتر',
            'بستگی به وزن فرد دارد',
          ],
          correctAnswer: 0,
        },
        {
          question: 'کمبود آب در بدن چه عارضه‌ای می‌تواند ایجاد کند؟',
          options: ['خستگی', 'سردرد', 'خشکی پوست', 'همه موارد'],
          correctAnswer: 3,
        },
      ],
    },
    {
      id: '6',
      title: 'جلسه ششم',
      description: `همه چیز درباره چربی ها`,
      videoSrc: 'https://backend.fitlinez.com/private/shape_up_academy_06.mp4',
      thumbnail: '',
      duration: 42,
      // difficulty: 'Beginner',
      instructor: 'آذر شفیعی',
      // equipment: ['Yoga Mat'],
      rating: 4.9,
      totalRatings: 1563,
      //category: 'Core',
      attachments: [
        {
          description: 'منابع چربی',
          url: 'https://backend.fitlinez.com/uploads/fat01.jpg',
        },
        {
          description: 'hand size portein',
          url: 'https://backend.fitlinez.com/uploads/handSizePortein.png',
        },
      ],
      quiz: [
        {
          question:
            'کدامیک از موارد زیر یک منبع عالی برای بهره‌مندی از چربی‌های چند غیر اشباع است؟',
          options: ['روغن آفتابگردان', 'دانه چیا', 'کره گیاهی', 'روغن نارگیل'],
          correctAnswer: 1,
        },
        {
          question:
            'کدامیک از اثرات زیر از فوائد مصرف چربی‌های سالم بر روی هورمون‌ها محسوب می‌شود؟',
          options: [
            'افزایش تولید هورمون کورتیزول',
            'بهبود تعادل هورمون‌های جنسی',
            'کاهش سطح هورمون انسولین',
            'افزایش هورمون‌های تیروئیدی',
          ],
          correctAnswer: 1,
        },
        {
          question: 'کدام یک از گزینه‌های زیر منبع خوبی از چربی‌های سالم است؟',
          options: ['کره حیوانی', 'روغن زیتون', 'مارگارین', 'روغن نباتی'],
          correctAnswer: 1,
        },
        {
          question: 'یک گرم چربی چند کالری دارد؟',
          options: ['۲ کالری', '۴ کالری', '۹ کالری', '۱۱ کالری'],
          correctAnswer: 2,
        },
      ],
    },
    {
      id: '7',
      title: 'جلسه هفتم',
      description: `سبزیجات و hand size portion`,
      videoSrc: 'https://backend.fitlinez.com/private/shape_up_academy_07.mp4',
      thumbnail: '',
      duration: 29,
      //difficulty: 'Beginner',
      instructor: 'آذر شفیعی',
      //  equipment: ['Yoga Mat'],
      rating: 4.9,
      totalRatings: 1563,
      //  category: 'Core',
      attachments: [
        {
          description: 'منابع سبزیجات',
          url: 'https://backend.fitlinez.com/uploads/vegetables01.jpg',
        },
        {
          description: 'hand size portein',
          url: 'https://backend.fitlinez.com/uploads/handSizePortein.png',
        },
      ],
      additionalLinks: [
        {
          link: 'https://t.me/+N-EXtwJ6_UdlYWJk',
          name: 'لینک گروه تلگرام',
        },
      ],
      quiz: [
        {
          question:
            'کدام ترکیب از مواد غذایی در یک بشقاب غذایی کامل و سالم بهتر است؟',
          options: [
            'مرغ کبابی، برنج قهوه‌ای، بروکلی بخارپز',
            'استیک گاو، سیب‌زمینی سرخ‌شده، هویج رنده‌شده',
            'ماهی سرخ‌شده، نان سفید، ذرت مکزیکی',
            'تخم‌مرغ آب‌پز، نان تست، خیار شور',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'برای تعیین مقدار مناسب چربی در رژیم غذایی، از کدام بخش دست می‌توان استفاده کرد؟',
          options: ['نوک انگشت سبابه', 'کف دست', 'انگشت شست', 'پشت دست'],
          correctAnswer: 2,
        },
        {
          question: '"Rainbow eating یا رنگین‌کمانی خوردن" به چه معناست؟',
          options: [
            'مصرف فقط سبزیجات سبز',
            'خوردن غذاهای متنوع از تمام گروه‌های غذایی',
            'مصرف سبزیجات در رنگ‌های مختلف',
            'خوردن غذاهای شیرین',
          ],
          correctAnswer: 2,
        },
        {
          question:
            'کدام یک از گزینه‌های زیر مزیت استفاده از روش Hand-sized Portion در چیدن بشقاب غذایی است؟',
          options: [
            'ایجاد وعده‌های غذایی کم‌کالری',
            'اندازه‌گیری ساده و بدون نیاز به ترازو',
            'مصرف پروتئین',
            'خوردن غذای کمتر',
          ],
          correctAnswer: 1,
        },
      ],
    },
    {
      id: '8',
      title: 'جلسه هشتم',
      description: `بررسی و مقایسه انواع رژیم های روز دنیا`,
      videoSrc: 'https://backend.fitlinez.com/private/shape_up_academy_08.mp4',
      thumbnail: '',
      duration: 51,
      //difficulty: 'Beginner',
      instructor: 'آذر شفیعی',
      // equipment: ['Yoga Mat'],
      rating: 4.9,
      totalRatings: 1563,
      // category: 'Core',
    },
    {
      id: '9',
      title: 'جلسه نهم',
      description: `همه چیز درباره مکمل های ضروری و غیر ضروری`,
      videoSrc: 'https://backend.fitlinez.com/private/shape_up_academy_09.mp4',
      thumbnail: '',
      duration: 35,
      // difficulty: 'Beginner',
      instructor: 'آذر شفیعی',
      //equipment: ['Yoga Mat'],
      rating: 4.9,
      totalRatings: 1563,
      //category: 'Core',
    },
    {
      id: '10',
      title: 'جلسه دهم',
      description: `جمع بندی مطالب، مثال عینی طراحی یک برنامه ی غذایی محاسبه کالری و چینش درصد ماکرویی ⁠هرم های تغذیه، پروتیین و کالری خروجی ⁠و منحنی یادگیری`,
      videoSrc: 'https://backend.fitlinez.com/private/shape_up_academy_10.mp4',
      thumbnail: '',
      duration: 53,
      // difficulty: 'Beginner',
      instructor: 'آذر شفیعی',
      //equipment: ['Yoga Mat'],
      rating: 4.9,
      totalRatings: 1563,
      //category: 'Core',
    },
  ];

  useEffect(() => {
    // Simulate loading video data
    const loadVideo = () => {
      setIsLoading(true);
      setTimeout(() => {
        const video = mockVideos.find((v) => v.id === (videoId || '1'));
        setCurrentVideo(video || mockVideos[0]);
        // setComments(mockComments);

        // Load user preferences
        const bookmarked = localStorage.getItem(`bookmark_${video?.id || '1'}`);
        setIsBookmarked(bookmarked === 'true');

        const rating = localStorage.getItem(`rating_${video?.id || '1'}`);
        setUserRating(rating ? parseInt(rating) : 0);

        setIsLoading(false);
      }, 1000);
    };

    loadVideo();
  }, [videoId]);

  const handleVideoProgress = (currentTime, duration) => {
    // Progress is automatically tracked by ProgressTracker component
  };

  const handleVideoComplete = () => {
    // Video completion is handled by ProgressTracker component
  };

  const handleBookmark = () => {
    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);
    localStorage.setItem(
      `bookmark_${currentVideo.id}`,
      newBookmarkState.toString()
    );
  };

  const handleRating = (rating) => {
    setUserRating(rating);
    localStorage.setItem(`rating_${currentVideo.id}`, rating.toString());
  };

  const handleAddComment = (content) => {
    const newComment = {
      id: Date.now().toString(),
      userName: 'John Doe',
      userAvatar: null,
      content: content,
      createdAt: new Date(),
      likes: 0,
      isLiked: false,
      isCoach: false,
      replies: [],
    };
    setComments((prev) => [newComment, ...prev]);
  };

  const handleLikeComment = (commentId) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          };
        }
        return comment;
      })
    );
  };

  const handleVideoSelect = (video) => {
    navigate(`/training-video-player/${video.id}`);
  };

  const getNextVideo = () => {
    if (!currentVideo) return null;
    const currentIndex = mockVideos.findIndex((v) => v.id === currentVideo.id);
    return currentIndex < mockVideos.length - 1
      ? mockVideos[currentIndex + 1]
      : null;
  };

  const getRelatedVideos = () => {
    if (!currentVideo) return [];
    return mockVideos
      .filter(
        (v) =>
          v.id !== currentVideo.id &&
          (v.category === currentVideo.category ||
            v.difficulty === currentVideo.difficulty)
      )
      .slice(0, 3);
  };

  const getSeriesVideos = () => {
    // Mock series data
    return mockVideos.map((video, index) => ({
      ...video,
      completed: index < mockVideos.findIndex((v) => v.id === currentVideo?.id),
      current: video.id === currentVideo?.id,
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <ContextualHeader />
        <div className="pt-16 pb-20 lg:pl-64 lg:pb-0">
          <div className="flex items-center justify-center h-96">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-muted-foreground">
                در حال بارگذاری ویدئوی جلسه
              </p>
            </div>
          </div>
        </div>
        <BottomTabNavigation />
      </div>
    );
  }

  if (!currentVideo) {
    return (
      <div className="min-h-screen bg-background">
        <ContextualHeader />
        <div className="pt-16 pb-20 lg:pl-64 lg:pb-0">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-lg font-medium text-card-foreground mb-2">
                ویدئویی پیدا نشد
              </p>
              <p className="text-muted-foreground"></p>
            </div>
          </div>
        </div>
        <BottomTabNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ContextualHeader />

      <div className="pt-16 pb-20 lg:pl-64 lg:pb-0">
        <div className="lg:flex lg:space-x-6 lg:p-6">
          {/* Main Content */}
          <div className="lg:flex-1 lg:max-w-4xl">
            {/* Video Player */}
            <div className="aspect-video bg-black lg:rounded-lg overflow-hidden">
              <VideoPlayer
                videoSrc={currentVideo.videoSrc}
                title={currentVideo.title}
                onProgress={handleVideoProgress}
                onComplete={handleVideoComplete}
                className="w-full h-full"
                attachments={currentVideo.attachments}
              />
            </div>

            {/* Video Details - Mobile */}
            <div className="lg:hidden p-4">
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

            {/* Comments Section - Mobile */}

            {/* {currentVideo.quiz && currentVideo.quiz.length > 0 && (
              <SessionQuiz quiz={currentVideo.quiz} />
            )} */}
            {/* <div className="lg:hidden p-4">
              <CommentsSection
                comments={comments}
                onAddComment={handleAddComment}
                onLikeComment={handleLikeComment}
              />
            </div> */}
          </div>

          {/* Sidebar - Desktop */}
          <div className="hidden lg:block lg:w-80 lg:space-y-6">
            {/* Video Details - Desktop */}
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
            />

            {/* Progress Tracker */}
            {/* <ProgressTracker
              videoId={currentVideo.id}
              totalDuration={currentVideo.duration * 60}
              onProgressUpdate={handleVideoProgress}
              onComplete={handleVideoComplete}
            /> */}

            {/* Video Recommendations */}
            <VideoRecommendations
              nextVideo={getNextVideo()}
              relatedVideos={getRelatedVideos()}
              seriesVideos={getSeriesVideos()}
              onVideoSelect={handleVideoSelect}
            />
          </div>
        </div>

        {/* Mobile Bottom Content */}
        <div className="lg:hidden space-y-4 p-4">
          {/* Progress Tracker - Mobile */}
          <ProgressTracker
            videoId={currentVideo.id}
            totalDuration={currentVideo.duration * 60}
            onProgressUpdate={handleVideoProgress}
            onComplete={handleVideoComplete}
          />

          {/* Video Recommendations - Mobile */}
          <VideoRecommendations
            nextVideo={getNextVideo()}
            relatedVideos={getRelatedVideos()}
            seriesVideos={getSeriesVideos()}
            onVideoSelect={handleVideoSelect}
          />

          {/* Comments Section - Desktop */}
          {/* <div className="hidden lg:block">
            <CommentsSection
              comments={comments}
              onAddComment={handleAddComment}
              onLikeComment={handleLikeComment}
            />
          </div> */}
        </div>
      </div>

      <BottomTabNavigation />
    </div>
  );
};

export default TrainingVideoPlayer;
