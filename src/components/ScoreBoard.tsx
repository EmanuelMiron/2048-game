
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
  const cardPadding = compact ? 'px-2 py-2' : 'px-4 py-3';
  const valueSize = compact ? 'text-lg' : 'text-2xl';
  const labelSize = compact ? 'text-[8px]' : 'text-[10px]';
  const subLabelSize = compact ? 'text-[9px]' : 'text-[11px]';
  const gap = compact ? 'gap-0.5' : 'gap-1';
  const borderRadius = compact ? 'rounded-xl' : 'rounded-2xl';
  const shadow = compact ? 'shadow-[3px_3px_0_rgba(17,17,17,0.35)]' : 'shadow-[6px_6px_0_rgba(17,17,17,0.35)]';

  return (
    <div className={`grid grid-cols-2 ${compact ? 'gap-1' : 'gap-2'} h-full`}>
      <div className="relative h-full">
        <div className={`h-full ${borderRadius} border-2 border-pop-coal dark:border-[#1a1a2e] bg-white dark:bg-[#FFB4C2] text-pop-coal dark:text-[#1a1a2e] ${shadow} dark:shadow-[3px_3px_0_rgba(0,0,0,0.3)] ${cardPadding} flex flex-col items-center justify-center ${gap} transition-all duration-500`}>
          <span className={`${labelSize} font-black uppercase tracking-[0.35em]`}>Score</span>
          <span className={`${valueSize} font-serif font-bold tabular-nums leading-none`}>{formatScore(score)}</span>
          {!compact && <span className={`${subLabelSize} font-semibold text-pop-coal/70 dark:text-[#1a1a2e]/70`}>live brag</span>}
        </div>

        {scoreIncrease > 0 && (
          <div
            className="absolute -top-7 left-1/2 -translate-x-1/2 text-terracotta-500 dark:text-[#FFE156] font-bold text-sm font-serif tabular-nums"
            style={{
              animation: 'scoreFloat 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            }}
          >
            +{formatScore(scoreIncrease)}
          </div>
        )}
      </div>

      <div className={`h-full ${borderRadius} border-2 border-pop-coal dark:border-[#1a1a2e] ${cardPadding} bg-pop-lemon dark:bg-[#87CEEB] text-pop-coal dark:text-[#1a1a2e] ${shadow} dark:shadow-[3px_3px_0_rgba(0,0,0,0.3)] flex flex-col items-center justify-center ${gap} transition-all duration-500`}>
        <span className={`${labelSize} font-black uppercase tracking-[0.35em]`}>Best</span>
        <span className={`${valueSize} font-serif font-bold tabular-nums leading-none`}>{formatScore(bestScore)}</span>
        {!compact && <span className={`${subLabelSize} font-semibold text-pop-coal/70 dark:text-[#1a1a2e]/70`}>all-time flex</span>}
      </div>
    </div>
  );
};
