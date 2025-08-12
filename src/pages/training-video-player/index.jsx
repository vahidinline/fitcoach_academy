import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ContextualHeader from '../../components/ui/ContextualHeader';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import VideoPlayer from './components/VideoPlayer';
import VideoDetails from './components/VideoDetails';
import VideoRecommendations from './components/VideoRecommendations';
import CommentsSection from './components/CommentsSection';
import ProgressTracker from './components/ProgressTracker';

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
      thumbnail:
        'https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg',
      duration: 49,
      //difficulty: 'Beginner',
      instructor: 'آذی شفیعی',
      // equipment: ['None - Bodyweight Only'],
      rating: 4.8,
      totalRatings: 1247,
      attachments: [
        {
          url: 'https://backend.fitlinez.com/uploads/fiber.jpg',
          description: 'فایل فیبر',
        },
      ],
      // category: 'HIIT',
    },
    {
      id: '2',
      title: 'جلسه دوم',
      description: `همه چیز درباره پروتیین`,
      videoSrc: 'https://backend.fitlinez.com/private/shape_up_academy_03.mp4',
      thumbnail:
        'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg',
      duration: 35,
      //difficulty: 'Intermediate',
      instructor: 'آذر شفیعی',
      //equipment: ['Dumbbells', 'Resistance Bands'],
      rating: 4.6,
      totalRatings: 892,
      //category: 'Strength',
    },
    {
      id: '3',
      title: 'جلسه سوم',
      description: `همه چیز درباره فیبر`,
      videoSrc: 'https://backend.fitlinez.com/private/shape_up_academy_03.mp4',
      thumbnail:
        'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg',
      duration: 40,
      //difficulty: 'Beginner',
      instructor: 'آذر شفیعی',
      //equipment: ['Yoga Mat'],
      rating: 4.9,
      totalRatings: 1563,
      category: 'Core',
    },
    {
      id: '4',
      title: 'جلسه چهارم',
      description: `همه چیز درباره فیبر`,
      videoSrc: 'https://backend.fitlinez.com/private/shape_up_academy_04.mp4',
      thumbnail:
        'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg',
      duration: 42,
      // difficulty: 'Beginner',
      instructor: 'آذر شفیعی',
      equipment: ['Yoga Mat'],
      rating: 4.9,
      totalRatings: 1563,
      // category: 'Core',
    },
    {
      id: '5',
      title: 'جلسه پنجم',
      description: `همه چیز درباره فیبر`,
      videoSrc: 'https://backend.fitlinez.com/private/shape_up_academy_05.mp4',
      thumbnail:
        'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg',
      duration: 58,
      // difficulty: 'Beginner',
      instructor: 'آذر شفیعی',
      // equipment: ['Yoga Mat'],
      rating: 4.9,
      totalRatings: 1563,
      //  category: 'Core',
    },
    {
      id: '6',
      title: 'جلسه ششم',
      description: `همه چیز درباره فیبر`,
      videoSrc: 'https://backend.fitlinez.com/private/shape_up_academy_06.mp4',
      thumbnail:
        'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg',
      duration: 42,
      // difficulty: 'Beginner',
      instructor: 'آذر شفیعی',
      // equipment: ['Yoga Mat'],
      rating: 4.9,
      totalRatings: 1563,
      //category: 'Core',
    },
    {
      id: '7',
      title: 'جلسه هفتم',
      description: `همه چیز درباره فیبر`,
      videoSrc: 'https://backend.fitlinez.com/private/shape_up_academy_07.mp4',
      thumbnail:
        'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg',
      duration: 29,
      //difficulty: 'Beginner',
      instructor: 'آذر شفیعی',
      //  equipment: ['Yoga Mat'],
      rating: 4.9,
      totalRatings: 1563,
      //  category: 'Core',
    },
    {
      id: '8',
      title: 'جلسه هشتم',
      description: `همه چیز درباره فیبر`,
      videoSrc: 'https://backend.fitlinez.com/private/shape_up_academy_08.mp4',
      thumbnail:
        'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg',
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
      description: `همه چیز درباره فیبر`,
      videoSrc: 'https://backend.fitlinez.com/private/shape_up_academy_09.mp4',
      thumbnail:
        'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg',
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
      description: `همه چیز درباره فیبر`,
      videoSrc: 'https://backend.fitlinez.com/private/shape_up_academy_10.mp4',
      thumbnail:
        'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg',
      duration: 53,
      // difficulty: 'Beginner',
      instructor: 'آذر شفیعی',
      //equipment: ['Yoga Mat'],
      rating: 4.9,
      totalRatings: 1563,
      //category: 'Core',
    },
  ];

  const mockComments = [
    {
      id: '1',
      userName: 'Alex Thompson',
      userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      content:
        'This workout is amazing! Perfect for beginners like me. Sarah explains everything so clearly and the modifications are really helpful.',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 24,
      isLiked: false,
      isCoach: false,
      replies: [
        {
          id: '1-1',
          userName: 'Sarah Johnson',
          userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          content:
            'Thank you Alex! So glad you found it helpful. Keep up the great work! 💪',
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          isCoach: true,
        },
      ],
    },
    {
      id: '2',
      userName: 'Maria Rodriguez',
      userAvatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      content:
        'Been doing this workout for 2 weeks now and already seeing improvements in my stamina. The 30-second intervals are perfect!',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      likes: 18,
      isLiked: true,
      isCoach: false,
      replies: [],
    },
    {
      id: '3',
      userName: 'David Kim',
      userAvatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      content:
        "Quick question - should I feel the burn in my legs during the jumping jacks? Want to make sure I'm doing it right.",
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      likes: 7,
      isLiked: false,
      isCoach: false,
      replies: [
        {
          id: '3-1',
          userName: 'Sarah Johnson',
          userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          content:
            "Yes David! That's completely normal. The burn in your legs means your muscles are working hard. Just make sure to land softly and keep good form.",
          createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
          isCoach: true,
        },
      ],
    },
  ];

  useEffect(() => {
    // Simulate loading video data
    const loadVideo = () => {
      setIsLoading(true);
      setTimeout(() => {
        const video = mockVideos.find((v) => v.id === (videoId || '1'));
        setCurrentVideo(video || mockVideos[0]);
        setComments(mockComments);

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
