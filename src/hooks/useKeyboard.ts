import { useEffect, useCallback } from 'react';
import { Direction } from '../types/game';

interface UseKeyboardProps {
  onMove: (direction: Direction) => boolean;
  onRestart: () => void;
  onUndo: () => void;
  disabled?: boolean;
}

export const useKeyboard = ({ onMove, onRestart, onUndo, disabled = false }: UseKeyboardProps) => {
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
      case 'z':
      case 'Z':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          onUndo();
        }
        break;
    }
  }, [onMove, onRestart, onUndo, disabled]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);
};