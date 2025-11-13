
import { Trophy, RefreshCw, Play } from 'lucide-react';

interface GameModalProps {
  gameStatus: 'playing' | 'won' | 'lost';
  score: number;
  bestScore: number;
  onRestart: () => void;
  onContinue?: () => void;
}

export const GameModal: React.FC<GameModalProps> = ({ 
  gameStatus, 
  score, 
  bestScore, 
  onRestart, 
  onContinue 
}) => {
  if (gameStatus === 'playing') return null;

  const isWon = gameStatus === 'won';

  return (
    <div className="fixed inset-0 bg-clay-500/40 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-500 animate-slide-in">
      <div className={`
        bg-cream-50 dark:bg-clay-950 rounded-3xl p-10 max-w-sm w-full text-center
        transform transition-all duration-500 scale-100
        border-2 ${isWon ? 'border-terracotta-400 dark:border-terracotta-300' : 'border-clay-400 dark:border-clay-300'}
      `}>
        {/* Icon */}
        <div className={`
          w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-500
          ${isWon ? 'bg-terracotta-100 dark:bg-terracotta-900/30 animate-gentle-pulse' : 'bg-clay-200 dark:bg-clay-800/40'}
        `}>
          {isWon ? (
            <Trophy className="w-10 h-10 text-terracotta-600 dark:text-terracotta-400" />
          ) : (
            <RefreshCw className="w-10 h-10 text-clay-600 dark:text-clay-400" />
          )}
        </div>

        {/* Title */}
        <h2 className={`
          text-4xl font-bold font-serif mb-3 transition-all duration-500 tracking-tight
          ${isWon ? 'text-terracotta-600 dark:text-terracotta-400' : 'text-clay-600 dark:text-clay-400'}
        `}>
          {isWon ? 'Victory!' : 'Game Over'}
        </h2>

        {/* Message */}
        <p className="text-clay-500 dark:text-sand-300 mb-8 transition-all duration-500 leading-relaxed">
          {isWon
            ? 'Congratulations! You reached 2048!'
            : 'No more moves available. Try again!'
          }
        </p>

        {/* Score */}
        <div className="bg-cream-200 dark:bg-clay-1000 rounded-2xl p-5 mb-8 transition-all duration-500 shadow-inner-soft border border-sand-300/30 dark:border-clay-700/20">
          <div className="text-sm font-semibold text-clay-400 dark:text-sand-400 uppercase tracking-wider mb-2 transition-all duration-500">Final Score</div>
          <div className="text-4xl font-bold font-serif text-clay-500 dark:text-cream-100 transition-all duration-500 tabular-nums">{score.toLocaleString()}</div>
          {score === bestScore && (
            <div className="text-sm text-terracotta-600 dark:text-terracotta-400 font-semibold mt-2 transition-all duration-500 animate-gentle-pulse">🎉 New Best!</div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          {isWon && onContinue && (
            <button
              onClick={onContinue}
              className="flex-1 flex items-center justify-center gap-2 bg-terracotta-500 hover:bg-terracotta-600 dark:bg-terracotta-600 dark:hover:bg-terracotta-700 text-white px-5 py-3.5 rounded-xl font-semibold transition-all duration-500  hover: transform hover:scale-105 active:scale-95 border border-terracotta-600/20 dark:border-terracotta-500/20"
            >
              <Play size={18} />
              Continue
            </button>
          )}

          <button
            onClick={onRestart}
            className={`
              flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold
              transition-all duration-500  hover: transform hover:scale-105 active:scale-95
              border
              ${isWon && onContinue
                ? 'flex-1 bg-clay-400 hover:bg-clay-500 dark:bg-clay-600 dark:hover:bg-clay-700 text-white border-clay-500/20 dark:border-clay-500/20'
                : 'w-full bg-terracotta-500 hover:bg-terracotta-600 dark:bg-terracotta-600 dark:hover:bg-terracotta-700 text-white border-terracotta-600/20 dark:border-terracotta-500/20'
              }
            `}
          >
            <RefreshCw size={18} />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};
