import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const LanguageToggle = () => {
  const [currentLanguage, setCurrentLanguage] = useState('fa');

  useEffect(() => {
    // Check localStorage for saved language preference - default to Persian
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'fa';
    setCurrentLanguage(savedLanguage);
    
    // Set the HTML direction based on language
    document.documentElement.setAttribute('dir', savedLanguage === 'fa' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', savedLanguage === 'fa' ? 'fa' : 'en');
  }, []);

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'fa' : 'en';
    setCurrentLanguage(newLanguage);
    localStorage.setItem('selectedLanguage', newLanguage);
    
    // Update HTML attributes
    document.documentElement.setAttribute('dir', newLanguage === 'fa' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', newLanguage === 'fa' ? 'fa' : 'en');
    
    // Trigger language change event for other components
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: newLanguage }));
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-lg hover:bg-muted animate-spring"
    >
      <Icon name="Globe" size={18} className="text-muted-foreground" />
      <span className="text-sm font-medium text-muted-foreground">
        {currentLanguage === 'fa' ? 'English' : 'فارسی'}
      </span>
    </button>
  );
};

export default LanguageToggle;