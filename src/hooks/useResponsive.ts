import { useState, useEffect } from 'react';

export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 400,
    height: typeof window !== 'undefined' ? window.innerHeight : 600
  });

  const [deviceInfo, setDeviceInfo] = useState({
    isTouchDevice: false,
    isIOS: false,
    isAndroid: false
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Detect device capabilities
    const detectDevice = () => {
      const userAgent = navigator.userAgent;
      setDeviceInfo({
        isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        isIOS: /iPad|iPhone|iPod/.test(userAgent),
        isAndroid: /Android/.test(userAgent)
      });
    };

    detectDevice();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive breakpoints
  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
  const isDesktop = windowSize.width >= 1024;
  
  // Calculate optimal container size based on device and screen
  const getContainerSize = () => {
    const padding = isMobile ? 16 : 32;
    const maxSize = isMobile ? 360 : 400;
    const availableWidth = windowSize.width - padding;
    const availableHeight = windowSize.height - (isMobile ? 200 : 300); // Account for UI elements
    
    return Math.min(maxSize, availableWidth, availableHeight);
  };

  const containerSize = getContainerSize();

  return {
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
    containerSize,
    deviceInfo
  };
};