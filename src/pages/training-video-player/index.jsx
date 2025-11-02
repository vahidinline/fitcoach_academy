import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ContextualHeader from '../../components/ui/ContextualHeader';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import VideoPlayer from './components/VideoPlayer';
import VideoDetails from './components/VideoDetails';
import VideoRecommendations from './components/VideoRecommendations';
import CommentsSection from './components/CommentsSection';
import ProgressTracker from './components/ProgressTracker';

import CommentForm from './components/CommentForm';
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
      thumbnail: Thumb01,
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
          url: 'https://backend.fitlinez.com/all/weight%20gain.webp',
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
    },
    {
      id: '2',
      title: 'جلسه دوم',
      description: `همه چیز درباره پروتیین`,
      videoSrc: 'https://backend.fitlinez.com/private/shape_up_academy_02.mp4',
      thumbnail: Thumb02,
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
    },
    {
      id: '3',
      title: 'جلسه سوم',
      description: `همه چیز درباره فیبر`,
      videoSrc: 'https://backend.fitlinez.com/private/shape_up_academy_03.mp4',
      thumbnail: Thumb03,
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
    },
    {
      id: '4',
      title: 'جلسه چهارم',
      description: `همه چیز درباره کربوهیدرات و قندها`,
      videoSrc: 'https://backend.fitlinez.com/private/shape_up_academy_04.mp4',
      thumbnail: Thumb04,
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
      ],
    },
    {
      id: '5',
      title: 'جلسه پنجم',
      description: `همه چیز درباره خواب و آب`,
      videoSrc: 'https://backend.fitlinez.com/private/shape_up_academy_05.mp4',
      thumbnail: Thumb05,
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
    },
    {
      id: '6',
      title: 'جلسه ششم',
      description: `همه چیز درباره چربی ها`,
      videoSrc: 'https://backend.fitlinez.com/private/shape_up_academy_06.mp4',
      thumbnail: Thumb06,
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
      ],
    },
    {
      id: '7',
      title: 'جلسه هفتم',
      description: `سبزیجات و hand size portion`,
      videoSrc: 'https://backend.fitlinez.com/private/shape_up_academy_07.mp4',
      thumbnail: Thumb07,
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
    },
    {
      id: '8',
      title: 'جلسه هشتم',
      description: `بررسی و مقایسه انواع رژیم های روز دنیا`,
      videoSrc: 'https://backend.fitlinez.com/private/shape_up_academy_08.mp4',
      thumbnail: Thumb08,
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
      thumbnail: Thumb09,
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
      thumbnail: Thumb10,
      duration: 53,
      // difficulty: 'Beginner',
      instructor: 'آذر شفیعی',
      //equipment: ['Yoga Mat'],
      rating: 4.9,
      totalRatings: 1563,
      //category: 'Core',
    },
    {
      id: '11',
      title: 'قسمت دوم -  جلسه دهم',
      description: `جمع بندی مطالب، مثال عینی طراحی یک برنامه ی غذایی محاسبه کالری و چینش درصد ماکرویی ⁠هرم های تغذیه، پروتیین و کالری خروجی ⁠و منحنی یادگیری`,
      videoSrc:
        'https://storage.googleapis.com/backend.fitlinez.com/private/xnz-mpvd-tjx%20(2024-05-16%2017_56%20GMT%2B1).mp4',
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
                thumbnail={currentVideo.thumbnail}
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
            {/* <CommentForm /> */}
            {/* Comments Section - Mobile */}

            <div className="lg:hidden p-4">
              <CommentsSection
                comments={comments}
                onAddComment={handleAddComment}
                onLikeComment={handleLikeComment}
              />
            </div>
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
              attachments={currentVideo.attachments}
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
          <div className="hidden lg:block">
            <CommentsSection
              // comments={comments}
              onAddComment={handleAddComment}
              onLikeComment={handleLikeComment}
            />
          </div>
        </div>
      </div>

      <BottomTabNavigation />
    </div>
  );
};

export default TrainingVideoPlayer;
