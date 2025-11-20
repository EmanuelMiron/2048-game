import { useEffect, useCallback } from 'react';
import { Direction } from '../types/game';

interface UseKeyboardProps {
  onMove: (direction: Direction) => boolean;
  onRestart: () => void;
  disabled?: boolean;
}

export const useKeyboard = ({ onMove, onRestart, disabled = false }: UseKeyboardProps) => {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (disabled) return;

    // Prevent default behavior for arrow keys to avoid page scrolling
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
    }

    switch (event.key) {
      case 'ArrowUp':
        onMove('up');
        break;
      case 'ArrowDown':
        onMove('down');
        break;
      case 'ArrowLeft':
        onMove('left');
        break;
      case 'ArrowRight':
        onMove('right');
        break;
      case 'r':
      case 'R':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          onRestart();
        }
        break;
    }
  }, [onMove, onRestart, disabled]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);
};