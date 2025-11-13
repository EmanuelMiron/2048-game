import { useState, useEffect, useRef } from 'react';
import { GameBoard, BOARD_GAP } from './GameBoard';
import { ScoreBoard } from './ScoreBoard';
import { GameControls } from './GameControls';
import { GameModal } from './GameModal';
import { ParticleEffect } from './ParticleEffect';
import { ThemeToggle } from './ThemeToggle';
import { useGameState } from '../hooks/useGameState';
import { useKeyboard } from '../hooks/useKeyboard';
import { useTouch } from '../hooks/useTouch';
import { useResponsive } from '../hooks/useResponsive';
import { GRID_SIZE } from '../utils/gameLogic';

interface ParticleInstance {
  id: string;
  x: number;
  y: number;
  color: string;
}

export const Game: React.FC = () => {
  const {
    gameState,
    makeMove,
    undoMove,
    restartGame,
    continueGame,
    animatingTiles,
    scoreIncrease
  } = useGameState();

  const { isMobile, deviceInfo, containerSize } = useResponsive();
  const boardRef = useRef<HTMLDivElement | null>(null);
  const gap = BOARD_GAP;
  const tileSize = Math.floor((containerSize - (GRID_SIZE + 1) * gap) / GRID_SIZE);
  const [particles, setParticles] = useState<ParticleInstance[]>([]);

  // Handle particle effects for merges
  useEffect(() => {
    if (!animatingTiles.length) return;

    const boardRect = boardRef.current?.getBoundingClientRect();
    if (!boardRect || tileSize <= 0) return;

    const newParticles = animatingTiles.map(tile => {
      const centerX = boardRect.left + gap + tile.col * (tileSize + gap) + tileSize / 2;
      const centerY = boardRect.top + gap + tile.row * (tileSize + gap) + tileSize / 2;

      return {
        id: `${tile.id}-${Date.now()}`,
        x: centerX,
        y: centerY,
        color: tile.value >= 1024 ? '#fbbf24' : tile.value >= 256 ? '#f59e0b' : '#fb923c'
      };
    });

    setParticles(prev => [...prev, ...newParticles]);
  }, [animatingTiles, gap, tileSize]);

  const removeParticle = (id: string) => {
    setParticles(prev => prev.filter(p => p.id !== id));
  };

  // Keyboard controls
  useKeyboard({
    onMove: makeMove,
    onRestart: restartGame,
    onUndo: undoMove,
    disabled: gameState.gameStatus !== 'playing'
  });

  // Touch controls
  const touchHandlers = useTouch({
    onMove: makeMove,
    disabled: gameState.gameStatus !== 'playing'
  });

  // Add viewport meta tag for mobile optimization
  useEffect(() => {
    if (isMobile && deviceInfo.isTouchDevice) {
      // Prevent zoom on double tap
      document.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      }, { passive: false });

      // Prevent pinch zoom
      document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      }, { passive: false });
    }
  }, [isMobile, deviceInfo.isTouchDevice]);

  return (
    <div
      className={`ambient-bg min-h-screen transition-all duration-500 flex flex-col items-center justify-center relative ${
        isMobile ? "p-3 pt-6 pb-[260px]" : "p-10 pt-16 pb-40"
      }
      }`}
    >
      <div className={`w-full relative z-10 px-0 md:px-4`}>
        {/* Game description */}
        <section className="absolute top-4 left-4 max-w-sm">
          <div className="relative rounded-[32px] border-2 border-pop-coal bg-pop-blush text-pop-coal px-6 py-6 shadow-[10px_10px_0_rgba(17,17,17,0.25)] dark:bg-clay-950 dark:text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.4em]">
                  Daily brain gym
                </p>
                <h1
                  className={`${
                    isMobile ? "text-4xl" : "text-[56px]"
                  } font-serif leading-none mt-2`}
                >
                  Witty tiles, tiny victories.
                </h1>
              </div>
            </div>
            <p className="mt-4 text-base md:text-lg font-semibold">
              Swipe like you mean it. Merge twins. Roast your high score in the
              group chat.
            </p>
          </div>
        </section>
        <GameBoard
          board={gameState.board}
          onTouchStart={touchHandlers.onTouchStart}
          onTouchEnd={touchHandlers.onTouchEnd}
          onTouchMove={touchHandlers.onTouchMove}
          onTouchCancel={touchHandlers.onTouchCancel}
          onContextMenu={touchHandlers.onContextMenu}
          isSwipeActive={touchHandlers.isSwipeActive}
          touchDirection={touchHandlers.touchState.direction}
          boardRef={boardRef}
        />
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[min(90vw,420px)] pointer-events-auto">
        <div className="flex items-center justify-between gap-3 px-4 py-4">
            <ScoreBoard
              score={gameState.score}
              bestScore={gameState.bestScore}
              scoreIncrease={scoreIncrease}
            />
            <GameControls
              onRestart={restartGame}
              onUndo={undoMove}
              canUndo={gameState.canUndo}
            />
        </div>
      </div>

      <GameModal
        gameStatus={gameState.gameStatus}
        score={gameState.score}
        bestScore={gameState.bestScore}
        onRestart={restartGame}
        onContinue={gameState.gameStatus === "won" ? continueGame : undefined}
      />

      {/* Particle Effects */}
      {particles.map((particle) => (
        <ParticleEffect
          key={particle.id}
          x={particle.x}
          y={particle.y}
          color={particle.color}
          onComplete={() => removeParticle(particle.id)}
        />
      ))}
    </div>
  );
};
