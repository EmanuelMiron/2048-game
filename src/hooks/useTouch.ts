import { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import { Direction } from '../types/game';

interface UseTouchProps {
  onMove: (direction: Direction) => boolean;
  disabled?: boolean;
}

interface TouchStart {
  x: number;
  y: number;
  time: number;
  identifier: number;
}

interface TouchState {
  isActive: boolean;
  direction: Direction | null;
  distance: number;
}

export const useTouch = ({ onMove, disabled = false }: UseTouchProps) => {
  const touchStart = useRef<TouchStart | null>(null);
  const [touchState, setTouchState] = useState<TouchState>({
    isActive: false,
    direction: null,
    distance: 0
  });

  // Configuration for swipe detection - memoized to prevent unnecessary re-renders
  const config = useMemo(() => ({
    minSwipeDistance: 30,        // Reduced for better mobile responsiveness
    maxSwipeTime: 1000,          // Maximum time for a valid swipe
    minSwipeVelocity: 0.1,       // Minimum velocity (pixels per ms)
    directionThreshold: 0.3,     // Minimum ratio for direction detection
    tapThreshold: 10,            // Maximum distance for tap detection
    maxTouchDuration: 2000       // Maximum touch duration
  }), []);

  const calculateDirection = useCallback((deltaX: number, deltaY: number): Direction | null => {
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    const totalDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Check if movement is significant enough
    if (totalDistance < config.minSwipeDistance) return null;

    // Determine primary direction based on larger movement
    if (absDeltaX > absDeltaY) {
      // Horizontal movement - check if it's dominant enough
      if (absDeltaX / totalDistance >= config.directionThreshold) {
        return deltaX > 0 ? 'right' : 'left';
      }
    } else {
      // Vertical movement - check if it's dominant enough
      if (absDeltaY / totalDistance >= config.directionThreshold) {
        return deltaY > 0 ? 'down' : 'up';
      }
    }

    return null;
  }, [config.minSwipeDistance, config.directionThreshold]);

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    if (disabled) return;

    // Only handle single touch
    if (event.touches.length !== 1) {
      touchStart.current = null;
      setTouchState({ isActive: false, direction: null, distance: 0 });
      return;
    }

    const touch = event.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
      identifier: touch.identifier
    };

    setTouchState({
      isActive: true,
      direction: null,
      distance: 0
    });

    // Prevent default to avoid scrolling and zooming
    event.preventDefault();
  }, [disabled]);

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    if (disabled || !touchStart.current) return;

    // Find the touch that matches our tracked touch
    const touch = Array.from(event.touches).find(
      t => t.identifier === touchStart.current!.identifier
    );

    if (!touch) return;

    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const direction = calculateDirection(deltaX, deltaY);

    setTouchState({
      isActive: true,
      direction,
      distance
    });

    // Prevent scrolling and other default behaviors
    event.preventDefault();
  }, [disabled, calculateDirection]);

  const handleTouchEnd = useCallback((event: React.TouchEvent) => {
    if (disabled || !touchStart.current) return;

    // Find the touch that matches our tracked touch
    const touch = Array.from(event.changedTouches).find(
      t => t.identifier === touchStart.current!.identifier
    );

    if (!touch) return;

    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    const deltaTime = Date.now() - touchStart.current.time;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / deltaTime;

    // Reset touch tracking
    touchStart.current = null;
    setTouchState({ isActive: false, direction: null, distance: 0 });

    // Validate swipe timing
    if (deltaTime > config.maxSwipeTime || deltaTime < 50) {
      event.preventDefault();
      return;
    }

    // Check for tap (very small movement)
    if (distance < config.tapThreshold) {
      event.preventDefault();
      return;
    }

    // Validate swipe distance and velocity
    if (distance < config.minSwipeDistance || velocity < config.minSwipeVelocity) {
      event.preventDefault();
      return;
    }

    // Calculate final direction
    const direction = calculateDirection(deltaX, deltaY);
    
    if (direction) {
      // Prevent default behavior and execute move
      event.preventDefault();
      
      // Add haptic feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      onMove(direction);
    }
  }, [disabled, onMove, calculateDirection, config]);

  const handleTouchCancel = useCallback((event: React.TouchEvent) => {
    // Reset state on touch cancel
    touchStart.current = null;
    setTouchState({ isActive: false, direction: null, distance: 0 });
    event.preventDefault();
  }, []);

  // Prevent context menu on long press
  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
  }, []);

  // Cleanup function for touch state
  const cleanup = useCallback(() => {
    touchStart.current = null;
    setTouchState({ isActive: false, direction: null, distance: 0 });
  }, []);



  // Cleanup on unmount or when disabled changes
  useEffect(() => {
    if (disabled) {
      cleanup();
    }
    
    return cleanup;
  }, [disabled, cleanup]);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchCancel,
    onContextMenu: handleContextMenu,
    touchState,
    isSwipeActive: touchState.isActive && touchState.distance > config.minSwipeDistance / 2,
    cleanup
  };
};