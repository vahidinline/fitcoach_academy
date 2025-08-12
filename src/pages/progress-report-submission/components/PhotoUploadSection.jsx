import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PhotoUploadSection = ({ 
  title, 
  description, 
  photos, 
  onPhotosChange, 
  maxPhotos = 2,
  acceptedTypes = "image/*"
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024 // 10MB limit
    );

    if (photos.length + validFiles.length > maxPhotos) {
      alert(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    validFiles.forEach((file, index) => {
      const fileId = Date.now() + index;
      
      // Simulate upload progress
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto = {
          id: fileId,
          file: file,
          preview: e.target.result,
          name: file.name,
          size: file.size,
          status: 'uploading'
        };

        onPhotosChange([...photos, newPhoto]);

        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 30;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setUploadProgress(prev => {
              const updated = { ...prev };
              delete updated[fileId];
              return updated;
            });
            
            // Update photo status to completed
            onPhotosChange(prevPhotos => 
              prevPhotos.map(photo => 
                photo.id === fileId 
                  ? { ...photo, status: 'completed' }
                  : photo
              )
            );
          }
          setUploadProgress(prev => ({ ...prev, [fileId]: Math.min(progress, 100) }));
        }, 200);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (photoId) => {
    onPhotosChange(photos.filter(photo => photo.id !== photoId));
    setUploadProgress(prev => {
      const updated = { ...prev };
      delete updated[photoId];
      return updated;
    });
  };

  const retryUpload = (photoId) => {
    const photo = photos.find(p => p.id === photoId);
    if (photo) {
      setUploadProgress(prev => ({ ...prev, [photoId]: 0 }));
      
      // Simulate retry
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 25;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadProgress(prev => {
            const updated = { ...prev };
            delete updated[photoId];
            return updated;
          });
          
          onPhotosChange(prevPhotos => 
            prevPhotos.map(p => 
              p.id === photoId 
                ? { ...p, status: 'completed' }
                : p
            )
          );
        }
        setUploadProgress(prev => ({ ...prev, [photoId]: Math.min(progress, 100) }));
      }, 150);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Upload Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : photos.length >= maxPhotos
            ? 'border-muted bg-muted/20' :'border-border hover:border-primary hover:bg-primary/5'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={handleFileInput}
          className="hidden"
          disabled={photos.length >= maxPhotos}
        />

        {photos.length < maxPhotos ? (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Icon name="Camera" size={24} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                Drop photos here or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG up to 10MB • {photos.length}/{maxPhotos} photos
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                iconName="Upload"
                iconPosition="left"
              >
                Choose Files
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="Camera"
                iconPosition="left"
              >
                Take Photo
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Icon name="CheckCircle" size={24} className="text-success mx-auto" />
            <p className="text-sm text-muted-foreground">
              Maximum photos uploaded ({maxPhotos}/{maxPhotos})
            </p>
          </div>
        )}
      </div>

      {/* Photo Previews */}
      {photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative bg-card border border-border rounded-lg overflow-hidden">
              <div className="aspect-video relative">
                <Image
                  src={photo.preview}
                  alt={photo.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Upload Progress Overlay */}
                {uploadProgress[photo.id] !== undefined && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-sm font-medium">{Math.round(uploadProgress[photo.id])}%</p>
                    </div>
                  </div>
                )}

                {/* Status Icons */}
                <div className="absolute top-2 right-2">
                  {photo.status === 'completed' && (
                    <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                      <Icon name="Check" size={14} className="text-success-foreground" />
                    </div>
                  )}
                  {photo.status === 'failed' && (
                    <div className="w-6 h-6 bg-destructive rounded-full flex items-center justify-center">
                      <Icon name="X" size={14} className="text-destructive-foreground" />
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removePhoto(photo.id)}
                  className="absolute top-2 left-2 w-6 h-6 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center animate-spring"
                >
                  <Icon name="Trash2" size={14} className="text-white" />
                </button>
              </div>

              <div className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">
                      {photo.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(photo.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                  
                  {photo.status === 'failed' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => retryUpload(photo.id)}
                      iconName="RotateCcw"
                      iconPosition="left"
                    >
                      Retry
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoUploadSection;