import { useState } from 'react';
import { RotateCcw, Undo2 } from 'lucide-react';

interface GameControlsProps {
  onRestart: () => void;
  onUndo: () => void;
  canUndo: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({ 
  onRestart, 
  onUndo, 
  canUndo 
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRestart = () => {
    if (showConfirm) {
      onRestart();
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowConfirm(false), 3000);
    }
  };

  const handleUndo = () => {
    if (canUndo) {
      onUndo();
    }
  };

  return (
    <div className="flex gap-3 mb-6">
      <button
        onClick={handleRestart}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-semibold
          transition-all duration-300 transform hover:scale-105 shadow-md
          ${showConfirm 
            ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white shadow-red-200 dark:shadow-red-900/30' 
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 shadow-gray-200 dark:shadow-gray-900/30'
          }
        `}
        aria-label={showConfirm ? 'Confirm restart' : 'Restart game'}
      >
        <RotateCcw size={18} />
        {showConfirm ? 'Confirm?' : 'Restart'}
      </button>
      
      <button
        onClick={handleUndo}
        disabled={!canUndo}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-semibold
          transition-all duration-300 transform shadow-md
          ${canUndo 
            ? 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white hover:scale-105 shadow-blue-200 dark:shadow-blue-900/30' 
            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed shadow-gray-200 dark:shadow-gray-900/30'
          }
        `}
        aria-label="Undo last move"
      >
        <Undo2 size={18} />
        Undo
      </button>
    </div>
  );
};