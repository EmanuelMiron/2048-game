
import { formatScore } from '../utils/gameLogic';

interface ScoreBoardProps {
  score: number;
  bestScore: number;
  scoreIncrease?: number;
  compact?: boolean;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  bestScore,
  scoreIncrease = 0,
  compact = false
}) => {
  const cardPadding = compact ? 'px-3 py-3' : 'px-5 py-4';
  const valueSize = compact ? 'text-xl' : 'text-3xl';
  const containerClass = compact
    ? 'grid grid-cols-2 gap-2 items-stretch'
    : 'grid grid-cols-2 gap-4 w-full';

  return (
    <div className={containerClass}>
      <div className="relative">
        <div className={`rounded-2xl border-2 border-pop-coal dark:border-white/70 bg-white dark:bg-clay-900 text-pop-coal dark:text-white shadow-[6px_6px_0_rgba(17,17,17,0.35)] ${cardPadding} flex flex-col items-center gap-1 transition-all duration-500`}>
          <span className="text-[10px] font-black uppercase tracking-[0.35em]">Score</span>
          <span className={`${valueSize} font-serif font-bold tabular-nums`}>{formatScore(score)}</span>
          <span className="text-[11px] font-semibold text-pop-coal/70 dark:text-white/70">live brag</span>
        </div>

        {scoreIncrease > 0 && (
          <div
            className="absolute -top-7 left-1/2 -translate-x-1/2 text-terracotta-500 dark:text-terracotta-300 font-bold text-sm font-serif tabular-nums"
            style={{
              animation: 'scoreFloat 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            }}
          >
            +{formatScore(scoreIncrease)}
          </div>
        )}
      </div>

      <div className={`rounded-2xl border-2 border-pop-coal dark:border-white/70 ${cardPadding} bg-pop-lemon dark:bg-clay-800 text-pop-coal dark:text-white shadow-[6px_6px_0_rgba(17,17,17,0.35)] flex flex-col items-center gap-1 transition-all duration-500`}>
        <span className="text-[10px] font-black uppercase tracking-[0.35em]">Best</span>
        <span className={`${valueSize} font-serif font-bold tabular-nums`}>{formatScore(bestScore)}</span>
        <span className="text-[11px] font-semibold text-pop-coal/70 dark:text-white/70">all-time flex</span>
      </div>
    </div>
  );
};
