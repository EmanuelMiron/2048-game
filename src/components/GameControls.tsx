import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

interface GameControlsProps {
  onRestart: () => void;
  compact?: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onRestart,
  compact = false
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

  const iconSize = compact ? 16 : 20;
  const labelSize = compact ? 'text-[8px]' : 'text-xs';
  const gap = compact ? 'gap-0.5' : 'gap-1';
  const padding = compact ? 'px-3 py-2' : 'px-6 py-3';
  const borderRadius = compact ? 'rounded-xl' : 'rounded-2xl';
  const shadow = compact ? 'shadow-[3px_3px_0_rgba(17,17,17,0.35)]' : 'shadow-[6px_6px_0_rgba(17,17,17,0.35)]';

  return (
    <button
      onClick={handleRestart}
      className={`h-full ${padding} ${borderRadius} border-2 border-pop-coal dark:border-[#1a1a2e] ${shadow} dark:shadow-[3px_3px_0_rgba(0,0,0,0.3)] flex flex-col items-center justify-center ${gap} font-semibold text-sm transition-all duration-300 active:translate-y-0.5 ${showConfirm ? 'bg-pop-lemon dark:bg-[#FFE156] text-pop-coal dark:text-[#1a1a2e] animate-gentle-pulse' : 'bg-white dark:bg-[#E0BBE4] text-pop-coal dark:text-[#1a1a2e]'}`}
      aria-label={showConfirm ? 'Confirm restart' : 'Restart game'}
    >
      <RotateCcw size={iconSize} className={showConfirm ? 'animate-spin' : ''} style={{ animationDuration: showConfirm ? '1s' : undefined }} />
      <span className={`${labelSize} font-black uppercase tracking-wider`}>{showConfirm ? 'Sure?' : 'Reset'}</span>
    </button>
  );
};
