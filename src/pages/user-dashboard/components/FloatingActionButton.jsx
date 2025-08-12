import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const FloatingActionButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/progress-report-submission');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-elevation-2 hover:shadow-lg animate-spring z-50 flex items-center justify-center group"
      aria-label="Submit Progress Report"
    >
      <Icon name="Plus" size={24} className="group-hover:scale-110 animate-spring" />
    </button>
  );
};

export default FloatingActionButton;