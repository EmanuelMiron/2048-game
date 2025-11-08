
import { formatScore } from '../utils/gameLogic';

interface ScoreBoardProps {
  score: number;
  bestScore: number;
  scoreIncrease?: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ 
  score, 
  bestScore, 
  scoreIncrease = 0 
}) => {
  return (
    <div className="flex gap-4 mb-6">
      <div className="relative">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg px-4 py-3 min-w-[100px] text-center transition-colors duration-300 shadow-md dark:shadow-gray-900/30">
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide transition-colors duration-300">
            Score
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
            {formatScore(score)}
          </div>
        </div>
        
        {/* Score increase animation */}
        {scoreIncrease > 0 && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-green-600 dark:text-green-400 font-bold text-lg animate-bounce transition-colors duration-300">
            +{formatScore(scoreIncrease)}
          </div>
        )}
      </div>
      
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg px-4 py-3 min-w-[100px] text-center transition-colors duration-300 shadow-md dark:shadow-gray-900/30">
        <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide transition-colors duration-300">
          Best
        </div>
        <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
          {formatScore(bestScore)}
        </div>
      </div>
    </div>
  );
};