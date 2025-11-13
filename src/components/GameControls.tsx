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

  const baseButton = 'px-5 py-3 rounded-2xl border-2 border-pop-coal dark:border-white/80 shadow-[6px_6px_0_rgba(17,17,17,0.35)] flex-1 min-w-[140px]';

  return (
    <div className="flex gap-3 flex-wrap">
      <button
        onClick={handleRestart}
        className={`flex items-center justify-center gap-2 font-semibold text-sm md:text-base transition-all duration-300 active:translate-y-0.5 ${baseButton} ${showConfirm ? 'bg-pop-lemon dark:bg-pop-coal text-pop-coal dark:text-white animate-gentle-pulse' : 'bg-white dark:bg-clay-900'}`}
        aria-label={showConfirm ? 'Confirm restart' : 'Restart game'}
      >
        <RotateCcw size={18} className={showConfirm ? 'animate-spin' : ''} style={{ animationDuration: showConfirm ? '1s' : undefined }} />
        <span>{showConfirm ? 'Sure?' : 'Do Over'}</span>
      </button>

      <button
        onClick={handleUndo}
        disabled={!canUndo}
        className={`flex items-center justify-center gap-2 font-semibold text-sm md:text-base transition-all duration-300 ${baseButton} ${canUndo ? 'bg-pop-sky text-pop-coal dark:text-pop-coal' : 'bg-pop-lilac text-pop-coal/40 dark:text-white/30 cursor-not-allowed'}`}
        aria-label="Undo last move"
      >
        <Undo2 size={18} />
        <span>Undo</span>
      </button>
    </div>
  );
};
