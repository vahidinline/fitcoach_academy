import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VideoDetails = ({
  title,
  description,
  difficulty,
  duration,
  equipment,
  instructor,
  rating,
  totalRatings,
  isBookmarked,

  onBookmark,
  onRate,
  userRating,
  attachments,
  className = '',
}) => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [showRating, setShowRating] = useState(false);
  const safeAttachments = Array.isArray(attachments) ? attachments : [];

  console.log('safeAttachments', safeAttachments);
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
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

  const handleRating = (stars) => {
    onRate?.(stars);
    setShowRating(false);
  };

  return (
    <div
      dir="rtl"
      className={`bg-card rounded-lg border border-border ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-card-foreground mb-2">
              {title}
            </h1>
            <p className="text-md font-bold mb-2 text-muted-foreground">
              {description}
            </p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="flex items-center space-x-1">
                <Icon name="Clock" size={16} />
                <span>{duration} دقیقه</span>
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                  difficulty
                )}`}>
                {difficulty}
              </span>
              <span className="flex items-center space-x-1">
                <Icon name="User" size={16} />
                <span>{instructor}</span>
              </span>
            </div>
          </div>

          <button
            onClick={onBookmark}
            className={`p-2 rounded-lg animate-spring ${
              isBookmarked
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}>
            <Icon name="Bookmark" size={20} />
          </button>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between">
          {/* <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon
                  key={star}
                  name="Star"
                  size={16}
                  className={
                    star <= Math.floor(rating)
                      ? 'text-warning fill-current'
                      : 'text-muted-foreground'
                  }
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {rating.toFixed(1)} ({totalRatings} reviews)
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRating(!showRating)}>
            امتیاز این ویدئو
          </Button>*/}
        </div>

        {/* Rating Modal */}
        {showRating && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium text-card-foreground mb-3">
              به این ویدئو امتیاز بدهید
            </p>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  className="p-1 hover:scale-110 animate-spring">
                  <Icon
                    name="Star"
                    size={24}
                    className={
                      star <= (userRating || 0)
                        ? 'text-warning fill-current'
                        : 'text-muted-foreground hover:text-warning'
                    }
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Expandable Sections */}
      <div className="divide-y divide-border">
        {/* Description */}
        <div className="p-6">
          <button
            onClick={() => toggleSection('description')}
            className="flex items-center justify-between w-full text-left">
            <h3 className="font-medium text-card-foreground">توضیحات</h3>
            <Icon
              name="ChevronDown"
              size={20}
              className={`text-muted-foreground transition-transform ${
                expandedSection === 'description' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {expandedSection === 'description' && (
            <div className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {description}
            </div>
          )}
        </div>
        <div className="p-6">
          <button
            onClick={() => toggleSection('attachments')}
            className="flex items-center justify-between w-full text-left">
            <h3 className="font-medium text-card-foreground flex items-center gap-2">
              <Icon name="Paperclip" size={18} />
              پیوست‌ها
            </h3>
            <Icon
              name="ChevronDown"
              size={20}
              className={`text-muted-foreground transition-transform ${
                expandedSection === 'attachments' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {expandedSection === 'attachments' && (
            <div className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {attachments && attachments.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {attachments.map((item, i) => (
                    <div
                      key={i}
                      className="relative group w-32 h-32 bg-muted rounded-lg overflow-hidden">
                      {item.url?.match(/\.(jpeg|jpg|png|webp)$/i) ? (
                        <img
                          src={item.url}
                          alt={`attachment-${i}`}
                          className="w-full h-full object-cover group-hover:opacity-80 transition"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Icon name="FileText" size={40} />
                        </div>
                      )}
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Icon
                          name="ExternalLink"
                          size={20}
                          className="text-white"
                        />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground/70 text-sm mt-2">
                  هیچ پیوستی موجود نیست.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Equipment */}
        {equipment && equipment.length > 0 && (
          <div className="p-6">
            <button
              onClick={() => toggleSection('equipment')}
              className="flex items-center justify-between w-full text-left">
              <h3 className="font-medium text-card-foreground">
                ابزار های مورد نیاز
              </h3>
              <Icon
                name="ChevronDown"
                size={20}
                className={`text-muted-foreground transition-transform ${
                  expandedSection === 'equipment' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {expandedSection === 'equipment' && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {equipment.map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Workout Tips */}
        <div className="p-6">
          <button
            onClick={() => toggleSection('tips')}
            className="flex items-center justify-between w-full text-left">
            <h3 className="font-medium text-card-foreground">نکات کلیدی</h3>
            <Icon
              name="ChevronDown"
              size={20}
              className={`text-muted-foreground transition-transform ${
                expandedSection === 'tips' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {expandedSection === 'tips' && (
            <div className="mt-4 space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground"></p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground"></p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground"></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;
