
import type { Ref } from 'react';
import { Tile } from './Tile';
import { Tile as TileType } from '../types/game';
import { GRID_SIZE } from '../utils/gameLogic';
import { useResponsive } from '../hooks/useResponsive';

export const BOARD_GAP = 12;

interface GameBoardProps {
  board: (TileType | null)[][];
  onTouchStart?: (event: React.TouchEvent) => void;
  onTouchEnd?: (event: React.TouchEvent) => void;
  onTouchMove?: (event: React.TouchEvent) => void;
  onTouchCancel?: (event: React.TouchEvent) => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  isSwipeActive?: boolean;
  touchDirection?: 'up' | 'down' | 'left' | 'right' | null;
  boardRef?: Ref<HTMLDivElement>;
}

export const GameBoard = ({
  board,
  onTouchStart,
  onTouchEnd,
  onTouchMove,
  onTouchCancel,
  onContextMenu,
  isSwipeActive = false,
  touchDirection = null,
  boardRef
}: GameBoardProps) => {
  const { containerSize } = useResponsive();
  const gap = BOARD_GAP; // Increased gap for better separation
  const tileSize = Math.floor((containerSize - (GRID_SIZE + 1) * gap) / GRID_SIZE);

  // Create grid background
  const gridCells = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      gridCells.push(
        <div
          key={`${row}-${col}`}
          className="absolute rounded-2xl transition-all duration-500 bg-pop-blush/70 dark:bg-[#3a3a4e]"
          style={{
            left: `${col * (tileSize + gap) + gap}px`,
            top: `${row * (tileSize + gap) + gap}px`,
            width: `${tileSize}px`,
            height: `${tileSize}px`,
            boxShadow: 'inset 0 0 0 2px rgba(17, 17, 17, 0.08)'
          }}
        />
      );
    }
  }

  // Get all tiles from board
  const tiles = board.flat().filter((tile): tile is TileType => tile !== null);

  // Generate swipe direction indicator classes
  const getSwipeIndicatorClasses = () => {
    if (!isSwipeActive || !touchDirection) return '';

    const baseClasses = 'absolute inset-0 pointer-events-none transition-all duration-200 rounded-2xl';
    const directionClasses = {
      up: 'bg-gradient-to-t from-transparent via-terracotta-200/20 to-terracotta-400/30 dark:via-terracotta-400/20 dark:to-terracotta-300/30',
      down: 'bg-gradient-to-b from-transparent via-terracotta-200/20 to-terracotta-400/30 dark:via-terracotta-400/20 dark:to-terracotta-300/30',
      left: 'bg-gradient-to-l from-transparent via-terracotta-200/20 to-terracotta-400/30 dark:via-terracotta-400/20 dark:to-terracotta-300/30',
      right: 'bg-gradient-to-r from-transparent via-terracotta-200/20 to-terracotta-400/30 dark:via-terracotta-400/20 dark:to-terracotta-300/30'
    };

    return `${baseClasses} ${directionClasses[touchDirection]}`;
  };

  return (
    <div className="flex flex-col items-center">
      <div
        ref={boardRef}
        className={`relative rounded-[32px] border-4 border-pop-coal dark:border-[#1a1a2e] p-3 touch-none select-none transition-all duration-500 bg-pop-sky/80 dark:bg-[#2a2a3e] shadow-[12px_12px_0_rgba(17,17,17,0.2)] dark:shadow-[12px_12px_0_rgba(0,0,0,0.4)] ${
          isSwipeActive ? 'scale-[1.01]' : ''
        }`}
        style={{
          width: `${containerSize}px`,
          height: `${containerSize}px`,
          backgroundImage:
            "url(data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='none'/%3E%3Ccircle cx='12' cy='18' r='4' fill='%23f8dce2' opacity='0.45'/%3E%3Ccircle cx='68' cy='30' r='5' fill='%23fff2c4' opacity='0.4'/%3E%3Ccircle cx='100' cy='70' r='4' fill='%23dff2ff' opacity='0.35'/%3E%3C/svg%3E)"
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchMove={onTouchMove}
        onTouchCancel={onTouchCancel}
        onContextMenu={onContextMenu}
        role="grid"
        aria-label="2048 game board - swipe to move tiles"
        tabIndex={0}
      >
        {/* Swipe direction indicator */}
        {isSwipeActive && touchDirection && (
          <div className={getSwipeIndicatorClasses()} />
        )}
        
        {/* Grid background */}
        {gridCells}
        
        {/* Tiles */}
        {tiles.map((tile) => (
          <Tile key={tile.id} tile={tile} size={tileSize} gap={gap} />
        ))}
      </div>
      
      {/* Touch instruction for mobile */}
      <div className="mt-4 text-center text-xs text-clay-300 dark:text-sand-500 sm:hidden transition-all duration-500">
        <p>Swipe to move tiles</p>
      </div>
    </div>
  );
};
