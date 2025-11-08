import { useState, useEffect } from 'react';
import { GameBoard } from './GameBoard';
import { ScoreBoard } from './ScoreBoard';
import { GameControls } from './GameControls';
import { GameModal } from './GameModal';
import { ParticleEffect } from './ParticleEffect';
import { ThemeToggle } from './ThemeToggle';
import { useGameState } from '../hooks/useGameState';
import { useKeyboard } from '../hooks/useKeyboard';
import { useTouch } from '../hooks/useTouch';
import { useResponsive } from '../hooks/useResponsive';

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

  const { isMobile, deviceInfo } = useResponsive();
  const [particles, setParticles] = useState<ParticleInstance[]>([]);

  // Handle particle effects for merges
  useEffect(() => {
    if (animatingTiles.length > 0) {
      const newParticles = animatingTiles.map(tile => ({
        id: `${tile.id}-${Date.now()}`,
        x: (tile.col * 100) + 200, // Approximate position
        y: (tile.row * 100) + 200,
        color: tile.value >= 1024 ? '#fbbf24' : tile.value >= 256 ? '#f59e0b' : '#fb923c'
      }));
      
      setParticles(prev => [...prev, ...newParticles]);
    }
  }, [animatingTiles]);

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
    <div className={`min-h-screen transition-colors duration-300 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center justify-center ${
      isMobile ? 'p-2' : 'p-4'
    }`}>
      <div className={`w-full ${isMobile ? 'max-w-sm' : 'max-w-md'}`}>
        {/* Header with Theme Toggle */}
        <div className={`text-center ${isMobile ? 'mb-4' : 'mb-8'} relative`}>
          {/* Theme Toggle Button - positioned in top right */}
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          
          <h1 className={`${isMobile ? 'text-4xl' : 'text-5xl'} font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300`}>2048</h1>
          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
            Join the tiles, get to <strong>2048!</strong>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 transition-colors duration-300">
            <span className="hidden sm:inline">Use arrow keys or </span>
            <span className="sm:hidden">Swipe or use arrow keys to move tiles</span>
            <span className="hidden sm:inline">swipe to move tiles</span>
          </p>
        </div>

        {/* Score Board */}
        <div className="flex justify-center">
          <ScoreBoard 
            score={gameState.score}
            bestScore={gameState.bestScore}
            scoreIncrease={scoreIncrease}
          />
        </div>

        {/* Game Controls */}
        <div className="flex justify-center">
          <GameControls
            onRestart={restartGame}
            onUndo={undoMove}
            canUndo={gameState.canUndo}
          />
        </div>

        {/* Game Board */}
        <GameBoard
          board={gameState.board}
          onTouchStart={touchHandlers.onTouchStart}
          onTouchEnd={touchHandlers.onTouchEnd}
          onTouchMove={touchHandlers.onTouchMove}
          onTouchCancel={touchHandlers.onTouchCancel}
          onContextMenu={touchHandlers.onContextMenu}
          isSwipeActive={touchHandlers.isSwipeActive}
          touchDirection={touchHandlers.touchState.direction}
        />

        {/* Instructions */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300" role="region" aria-label="Game instructions">
          <p className="mb-2">
            <strong>HOW TO PLAY:</strong> 
            <span className="hidden sm:inline"> Use your arrow keys to move the tiles.</span>
            <span className="sm:hidden"> Swipe in any direction to move the tiles.</span>
          </p>
          <p className="mb-2">
            When two tiles with the same number touch, they merge into one!
          </p>
          <p className="hidden sm:block">
            <strong>Keyboard shortcuts:</strong> Ctrl+R (restart), Ctrl+Z (undo)
          </p>
          <p className="sm:hidden">
            <strong>Touch controls:</strong> Swipe to move, tap buttons to restart/undo
          </p>
        </div>
      </div>

      {/* Game Modal */}
      <GameModal
        gameStatus={gameState.gameStatus}
        score={gameState.score}
        bestScore={gameState.bestScore}
        onRestart={restartGame}
        onContinue={gameState.gameStatus === 'won' ? continueGame : undefined}
      />

      {/* Particle Effects */}
      {particles.map(particle => (
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