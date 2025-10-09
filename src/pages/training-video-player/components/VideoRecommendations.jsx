import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { Link } from 'react-router-dom';

const VideoRecommendations = ({
  nextVideo,
  relatedVideos = [],
  seriesVideos = [],
  onVideoSelect,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleVideoClick = (video) => {
    console.log('video', video);
    navigate(`/training-video-player/${video.id}`, { state: { video } });
  };

  const formatDuration = (minutes) => {
    return ` دقیقه ${minutes}`;
  };

  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'text-success bg-success/10';
      case 'intermediate':
        return 'text-warning bg-warning/10';
      case 'advanced':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div dir="rtl" className={`space-y-6 ${className}`}>
      {/* Next Video */}
      {nextVideo && (
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="PlayCircle" size={20} className="text-primary" />
            <h3 className="font-semibold text-card-foreground p-1">
              ویدئوی بعدی
            </h3>
          </div>

          <div className="flex space-x-4 ">
            <div className="relative w-32 h-20 flex-shrink-0">
              {/* <Image
                src={nextVideo.thumbnail}
                alt={nextVideo.title}
                className="w-full h-full object-cover rounded-lg"
              /> */}
              <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                <Icon name="Play" size={16} className="text-white" />
              </div>
              <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                {formatDuration(nextVideo.duration)}
              </div>
            </div>

            <div className="flex-1">
              <h4 className="font-medium text-card-foreground  line-clamp-2 p-1">
                {nextVideo.title}
              </h4>
              {/* <p className="text-xs text-muted-foreground m-2">
                {nextVideo.description}
              </p> */}
              {/* <div className="flex items-center space-x-2 mb-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                    nextVideo.difficulty
                  )}`}>
                  {nextVideo.difficulty}
                </span>
                <span className="text-xs text-muted-foreground">
                  {nextVideo.instructor}
                </span>
              </div> */}

              <Button className="m-1">
                <Link
                  variant="default"
                  size="sm"
                  to={`/training-video-player/${nextVideo.id}`}
                  className="w-full button-primary m-1 bg-green">
                  مشاهده بعدی
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Series Progress */}
      {seriesVideos.length > 0 && (
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-card-foreground">مسیر پیشرفت</h3>
            {/* <span className="text-sm text-muted-foreground">
              {seriesVideos.filter((v) => v.completed).length} of{' '}
              {seriesVideos.length} مشاهده شده
            </span> */}
          </div>

          <div className="space-y-3">
            {seriesVideos.map((video, index) => (
              <div
                key={video.id}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer animate-spring ${
                  video.current
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => handleVideoClick(video)}>
                <div className="flex-shrink-0">
                  {video.completed ? (
                    <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                      <Icon
                        name="Check"
                        size={14}
                        className="text-success-foreground"
                      />
                    </div>
                  ) : video.current ? (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Icon
                        name="Play"
                        size={12}
                        className="text-primary-foreground"
                      />
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-sm font-medium">
                      {index + 1}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      video.current ? 'text-primary' : 'text-card-foreground'
                    }`}>
                    {video.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDuration(video.duration)} • {video.difficulty}
                  </p>
                </div>

                {video.current && (
                  <Icon name="Volume2" size={16} className="text-primary" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Videos */}
      {/* {relatedVideos.length > 0 && (
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold text-card-foreground mb-4">
            Related Workouts
          </h3>

          <div className="space-y-4">
            {relatedVideos.map((video) => (
              <div
                key={video.id}
                className="flex space-x-4 cursor-pointer hover:bg-muted/50 p-3 rounded-lg animate-spring"
                onClick={() => handleVideoClick(video)}>
                <div className="relative w-24 h-16 flex-shrink-0">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover rounded"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded flex items-center justify-center">
                    <Icon name="Play" size={12} className="text-white" />
                  </div>
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                    {formatDuration(video.duration)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-card-foreground mb-1 line-clamp-2 text-sm">
                    {video.title}
                  </h4>
                  <div className="flex items-center space-x-2 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(
                        video.difficulty
                      )}`}>
                      {video.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Icon name="Star" size={12} />
                      <span>{video.rating}</span>
                    </span>
                    <span>{video.instructor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* Back to Dashboard */}
      <div className="bg-card rounded-lg border border-border p-6">
        <Button
          variant="outline"
          onClick={() => navigate('/user-dashboard')}
          className="w-full"
          iconName="ArrowLeft"
          iconPosition="left">
          بازگشت به پنل
        </Button>
      </div>
    </div>
  );
};

export default VideoRecommendations;
