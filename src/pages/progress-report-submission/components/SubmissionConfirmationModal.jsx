import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const SubmissionConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  formData,
  isSubmitting 
}) => {
  const [showFullPreview, setShowFullPreview] = useState(false);

  if (!isOpen) return null;

  const { beforeAfterPhotos, measurements, screenshots, notes } = formData;

  const getTotalPhotos = () => {
    return beforeAfterPhotos.length + screenshots.length;
  };

  const getCompletedSections = () => {
    let completed = 0;
    if (beforeAfterPhotos.length > 0) completed++;
    if (Object.keys(measurements).length > 0) completed++;
    if (screenshots.length > 0) completed++;
    if (Object.values(notes).some(note => note && note.trim())) completed++;
    return completed;
  };

  const getTotalWordCount = () => {
    return Object.values(notes).reduce((total, note) => {
      return total + (note ? note.trim().split(/\s+/).filter(word => word.length > 0).length : 0);
    }, 0);
  };

  const formatFileSize = (bytes) => {
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  };

  const getTotalFileSize = () => {
    const photoSizes = beforeAfterPhotos.reduce((total, photo) => total + photo.size, 0);
    const screenshotSizes = screenshots.reduce((total, screenshot) => total + screenshot.size, 0);
    return photoSizes + screenshotSizes;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-400 p-4">
      <div className="bg-card rounded-lg shadow-elevation-2 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Send" size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">Confirm Submission</h2>
              <p className="text-sm text-muted-foreground">
                Review your progress report before sending to your coach
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg animate-spring"
            disabled={isSubmitting}
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {/* Summary Stats */}
          <div className="p-6 border-b border-border">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Icon name="Image" size={16} className="text-primary" />
                </div>
                <p className="text-sm font-medium text-card-foreground">{getTotalPhotos()}</p>
                <p className="text-xs text-muted-foreground">Photos</p>
              </div>
              <div className="space-y-1">
                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <Icon name="Ruler" size={16} className="text-accent" />
                </div>
                <p className="text-sm font-medium text-card-foreground">
                  {Object.keys(measurements).filter(key => key !== 'unitSystem').length}
                </p>
                <p className="text-xs text-muted-foreground">Measurements</p>
              </div>
              <div className="space-y-1">
                <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                  <Icon name="FileText" size={16} className="text-success" />
                </div>
                <p className="text-sm font-medium text-card-foreground">{getTotalWordCount()}</p>
                <p className="text-xs text-muted-foreground">Words</p>
              </div>
              <div className="space-y-1">
                <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center mx-auto">
                  <Icon name="CheckCircle" size={16} className="text-warning" />
                </div>
                <p className="text-sm font-medium text-card-foreground">{getCompletedSections()}/4</p>
                <p className="text-xs text-muted-foreground">Sections</p>
              </div>
            </div>
          </div>

          {/* Detailed Preview */}
          <div className="p-6 space-y-6">
            {/* Photos Section */}
            {beforeAfterPhotos.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-card-foreground mb-3 flex items-center space-x-2">
                  <Icon name="Camera" size={16} className="text-primary" />
                  <span>Progress Photos ({beforeAfterPhotos.length})</span>
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {beforeAfterPhotos.slice(0, showFullPreview ? undefined : 4).map((photo) => (
                    <div key={photo.id} className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={photo.preview}
                        alt={photo.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {!showFullPreview && beforeAfterPhotos.length > 4 && (
                    <button
                      onClick={() => setShowFullPreview(true)}
                      className="aspect-square rounded-lg bg-muted/50 border-2 border-dashed border-border flex items-center justify-center hover:bg-muted animate-spring"
                    >
                      <div className="text-center">
                        <Icon name="Plus" size={16} className="text-muted-foreground mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">+{beforeAfterPhotos.length - 4}</p>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Measurements Section */}
            {Object.keys(measurements).filter(key => key !== 'unitSystem').length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-card-foreground mb-3 flex items-center space-x-2">
                  <Icon name="Ruler" size={16} className="text-accent" />
                  <span>Body Measurements</span>
                </h3>
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {Object.entries(measurements)
                      .filter(([key]) => key !== 'unitSystem')
                      .slice(0, 6)
                      .map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span className="text-card-foreground font-medium">
                            {typeof value === 'object' ? value.value : value}
                            {typeof value === 'object' ? value.unit : (measurements.unitSystem === 'metric' ? 'kg' : 'lbs')}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Screenshots Section */}
            {screenshots.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-card-foreground mb-3 flex items-center space-x-2">
                  <Icon name="Smartphone" size={16} className="text-success" />
                  <span>App Screenshots ({screenshots.length})</span>
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {screenshots.slice(0, 6).map((screenshot) => (
                    <div key={screenshot.id} className="aspect-[9/16] rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={screenshot.preview}
                        alt={screenshot.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes Preview */}
            {Object.values(notes).some(note => note && note.trim()) && (
              <div>
                <h3 className="text-sm font-medium text-card-foreground mb-3 flex items-center space-x-2">
                  <Icon name="FileText" size={16} className="text-warning" />
                  <span>Progress Notes</span>
                </h3>
                <div className="space-y-2">
                  {Object.entries(notes)
                    .filter(([, value]) => value && value.trim())
                    .map(([key, value]) => (
                      <div key={key} className="bg-muted/30 rounded-lg p-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-xs text-card-foreground line-clamp-2">
                          {value.substring(0, 100)}
                          {value.length > 100 && '...'}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* File Size Info */}
          <div className="px-6 pb-6">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Icon name="HardDrive" size={14} className="text-primary" />
                  <span className="text-primary">Total file size: {formatFileSize(getTotalFileSize())}</span>
                </div>
                <span className="text-primary/70">Estimated upload time: ~30 seconds</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="text-xs text-muted-foreground">
            Your coach will review this within 24-48 hours
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Review Again
            </Button>
            
            <Button
              variant="default"
              onClick={onConfirm}
              loading={isSubmitting}
              iconName="Send"
              iconPosition="left"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionConfirmationModal;