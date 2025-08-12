import React, { useState, useEffect } from 'react';

const LocationDetector = ({ onLocationDetected }) => {
  const [isDetecting, setIsDetecting] = useState(true);
  const [detectedLocation, setDetectedLocation] = useState(null);

  useEffect(() => {
    const detectUserLocation = async () => {
      try {
        // Simulate IP-based location detection
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        // Check if user is from Iran
        const isIranian = data.country_code === 'IR' || data.timezone?.includes('Tehran') ||
                         data.country?.toLowerCase().includes('iran');
        
        const location = isIranian ? 'iran' : 'international';
        setDetectedLocation(location);
        onLocationDetected(location);
      } catch (error) {
        // Fallback detection using timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const isIranian = timezone.includes('Tehran') || timezone.includes('Asia/Tehran');
        const location = isIranian ? 'iran' : 'international';
        
        setDetectedLocation(location);
        onLocationDetected(location);
      } finally {
        setIsDetecting(false);
      }
    };

    detectUserLocation();
  }, [onLocationDetected]);

  if (isDetecting) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-sm text-muted-foreground">Detecting location...</span>
      </div>
    );
  }

  return null;
};

export default LocationDetector;