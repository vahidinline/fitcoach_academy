import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TrainingVideoGrid = ({ videos }) => {
  const navigate = useNavigate();

  const handleVideoClick = (video) => {
    navigate('/training-video-player', { state: { video } });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
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

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">
          ویدئوهای آموزشی رایگان
        </h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Play" size={16} />
          <span>{videos.length} ویدئوی آموزشی</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {videos.map((video) => (
          <div
            key={video.id}
            onClick={() => handleVideoClick(video)}
            className="group cursor-pointer bg-muted/50 rounded-lg overflow-hidden hover:shadow-elevation-2 animate-spring">
            <div className="relative aspect-video">
              <Image
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 animate-spring">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Icon
                    name="Play"
                    size={20}
                    className="text-primary-foreground ml-1"
                  />
                </div>
              </div>

              {/* Duration Badge */}
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {formatDuration(video.duration)}
              </div>

              {/* Completion Status */}
              {video.completed && (
                <div className="absolute top-2 left-2 bg-success rounded-full p-1">
                  <Icon
                    name="Check"
                    size={12}
                    className="text-success-foreground"
                  />
                </div>
              )}
            </div>

            <div className="p-3">
              <h4 className="font-medium text-card-foreground text-sm mb-2 line-clamp-2">
                {video.title}
              </h4>

              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(
                    video.difficulty
                  )}`}>
                  {video.difficulty}
                </span>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Icon name="Eye" size={12} />
                  <span>{video.views}</span>
                </div>
              </div>

              {/* Progress Bar */}
              {video.progress > 0 && (
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full"
                    style={{ width: `${video.progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingVideoGrid;
