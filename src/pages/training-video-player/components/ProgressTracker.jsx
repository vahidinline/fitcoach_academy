import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProgressTracker = ({
  videoId,
  totalDuration,
  onProgressUpdate,
  onComplete,
  className = '',
}) => {
  const [watchTime, setWatchTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [showAchievement, setShowAchievement] = useState(null);

  useEffect(() => {
    // Load saved progress from localStorage
    const savedProgress = localStorage.getItem(`video_progress_${videoId}`);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setWatchTime(progress.watchTime || 0);
      setIsCompleted(progress.isCompleted || false);
    }
  }, [videoId]);

  useEffect(() => {
    // Save progress to localStorage
    const progress = {
      videoId,
      watchTime,
      isCompleted,
      lastWatched: new Date().toISOString(),
    };
    localStorage.setItem(`video_progress_${videoId}`, JSON.stringify(progress));

    // Update parent component
    onProgressUpdate?.(watchTime, totalDuration, isCompleted);

    // Check for completion
    if (watchTime >= totalDuration * 0.95 && !isCompleted) {
      setIsCompleted(true);
      onComplete?.();
      checkAchievements();
    }
  }, [
    watchTime,
    totalDuration,
    isCompleted,
    videoId,
    onProgressUpdate,
    onComplete,
  ]);

  const checkAchievements = () => {
    const newAchievements = [];

    // First video completion
    const completedVideos = getCompletedVideosCount();
    if (completedVideos === 1) {
      newAchievements.push({
        id: 'first_video',
        title: 'First Steps',
        description: 'Completed your first workout video!',
        icon: 'Trophy',
        color: 'text-warning',
      });
    }

    // Milestone achievements
    if (completedVideos === 5) {
      newAchievements.push({
        id: 'five_videos',
        title: 'Getting Started',
        description: 'Completed 5 workout videos!',
        icon: 'Award',
        color: 'text-success',
      });
    }

    if (completedVideos === 10) {
      newAchievements.push({
        id: 'ten_videos',
        title: 'Dedicated Learner',
        description: 'Completed 10 workout videos!',
        icon: 'Star',
        color: 'text-primary',
      });
    }

    if (newAchievements.length > 0) {
      setAchievements((prev) => [...prev, ...newAchievements]);
      setShowAchievement(newAchievements[0]);
      setTimeout(() => setShowAchievement(null), 5000);
    }
  };

  const getCompletedVideosCount = () => {
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('video_progress_')) {
        const progress = JSON.parse(localStorage.getItem(key) || '{}');
        if (progress.isCompleted) count++;
      }
    }
    return count;
  };

  const updateWatchTime = (currentTime) => {
    setWatchTime(Math.max(watchTime, currentTime));
  };

  const getProgressPercentage = () => {
    return totalDuration > 0
      ? Math.min((watchTime / totalDuration) * 100, 100)
      : 0;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div
        className={`bg-card rounded-lg border border-border p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-card-foreground">Your Progress</h3>
          {isCompleted && (
            <div className="flex items-center space-x-2 text-success">
              <Icon name="CheckCircle" size={20} />
              <span className="text-sm font-medium">Completed</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>
              {formatTime(watchTime)} / {formatTime(totalDuration)}
            </span>
            <span>{Math.round(getProgressPercentage())}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        {/* Time Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">مشاهده شده</p>
            <p className="text-lg font-semibold text-card-foreground font-mono">
              {formatTime(watchTime)}
            </p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">باقیمانده</p>
            <p className="text-lg font-semibold text-card-foreground font-mono">
              {formatTime(Math.max(0, totalDuration - watchTime))}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">ویدئوهای تکمیل شده:</span>
            <span className="font-medium text-card-foreground">
              {getCompletedVideosCount()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">دستاوردها کسب شده:</span>
            <span className="font-medium text-card-foreground">
              {achievements.length}
            </span>
          </div>
        </div>

        {/* Continue Watching Button */}
        {!isCompleted && watchTime > 0 && (
          <div className="mt-4">
            <Button
              variant="outline"
              className="w-full"
              iconName="Play"
              iconPosition="left">
              ادامه مشاهده
              {formatTime(watchTime)}
            </Button>
          </div>
        )}
      </div>

      {/* Achievement Notification */}
      {showAchievement && (
        <div className="fixed top-20 right-4 bg-card border border-border rounded-lg shadow-elevation-2 p-4 z-300 animate-spring">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center ${showAchievement.color}`}>
              <Icon name={showAchievement.icon} size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-card-foreground text-sm">
                {showAchievement.title}
              </h4>
              <p className="text-sm font-medium text-card-foreground">
                {showAchievement.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {showAchievement.description}
              </p>
            </div>
            <button
              onClick={() => setShowAchievement(null)}
              className="p-1 hover:bg-muted rounded">
              <Icon name="X" size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProgressTracker;
