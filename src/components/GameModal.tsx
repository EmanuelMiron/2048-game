
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
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-50 p-4 transition-colors duration-300">
      <div className={`
        bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full text-center
        transform transition-all duration-300 scale-100 shadow-2xl
        ${isWon ? 'border-4 border-yellow-400 dark:border-yellow-500' : 'border-4 border-red-400 dark:border-red-500'}
      `}>
        {/* Icon */}
        <div className={`
          w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors duration-300
          ${isWon ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-red-100 dark:bg-red-900/30'}
        `}>
          {isWon ? (
            <Trophy className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          ) : (
            <RefreshCw className="w-8 h-8 text-red-600 dark:text-red-400" />
          )}
        </div>

        {/* Title */}
        <h2 className={`
          text-3xl font-bold mb-2 transition-colors duration-300
          ${isWon ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}
        `}>
          {isWon ? 'You Win!' : 'Game Over!'}
        </h2>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-300">
          {isWon 
            ? 'Congratulations! You reached 2048!' 
            : 'No more moves available. Try again!'
          }
        </p>

        {/* Score */}
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6 transition-colors duration-300">
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-1 transition-colors duration-300">Final Score</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">{score.toLocaleString()}</div>
          {score === bestScore && (
            <div className="text-sm text-green-600 dark:text-green-400 font-semibold mt-1 transition-colors duration-300">New Best!</div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          {isWon && onContinue && (
            <button
              onClick={onContinue}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Play size={18} />
              Continue
            </button>
          )}
          
          <button
            onClick={onRestart}
            className={`
              flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold
              transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105
              ${isWon && onContinue 
                ? 'flex-1 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white' 
                : 'w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white'
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