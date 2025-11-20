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
      className={`ambient-bg min-h-screen transition-all duration-500 flex items-center justify-center relative ${
        isMobile ? "p-3 pt-6 pb-[160px]" : "p-10 pb-32"
      }
      }`}
    >
      {/* Main content: centered layout */}
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center gap-8">
          {/* Game description */}
          <section className="w-full max-w-2xl">
            <div className="relative rounded-[32px] border-2 border-pop-coal bg-pop-blush text-pop-coal px-6 py-6 shadow-[10px_10px_0_rgba(17,17,17,0.25)] dark:bg-[#A8E6CF] dark:text-[#1a1a2e] dark:border-[#1a1a2e] dark:shadow-[10px_10px_0_rgba(0,0,0,0.3)] transition-all duration-500">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.4em]">
                    Daily brain gym
                  </p>
                  <h1
                    className={`${
                      isMobile ? "text-4xl" : "text-5xl"
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

          {/* Game board */}
          <div className="flex-shrink-0">
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
        </div>
      </div>

      {/* Fixed footer with controls */}
      <div className="fixed bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 w-[min(98vw,600px)] pointer-events-auto">
        <div className="flex flex-row gap-1.5 sm:gap-3 px-2 sm:px-4 py-2 sm:py-4 items-stretch justify-center">
          <div className="flex-1 max-w-xs min-w-0">
            <ScoreBoard
              score={gameState.score}
              bestScore={gameState.bestScore}
              scoreIncrease={scoreIncrease}
              compact={isMobile}
            />
          </div>
          <div className="flex items-stretch gap-1.5 sm:gap-3">
            <GameControls
              onRestart={restartGame}
              compact={isMobile}
            />
            <ThemeToggle compact={isMobile} />
          </div>
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
