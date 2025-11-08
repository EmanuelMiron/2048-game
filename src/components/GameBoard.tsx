
import { Tile } from './Tile';
import { Tile as TileType } from '../types/game';
import { GRID_SIZE } from '../utils/gameLogic';
import { useResponsive } from '../hooks/useResponsive';

interface GameBoardProps {
  board: (TileType | null)[][];
  onTouchStart?: (event: React.TouchEvent) => void;
  onTouchEnd?: (event: React.TouchEvent) => void;
  onTouchMove?: (event: React.TouchEvent) => void;
  onTouchCancel?: (event: React.TouchEvent) => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  isSwipeActive?: boolean;
  touchDirection?: 'up' | 'down' | 'left' | 'right' | null;
}

export const GameBoard = ({ 
  board, 
  onTouchStart, 
  onTouchEnd, 
  onTouchMove,
  onTouchCancel,
  onContextMenu,
  isSwipeActive = false,
  touchDirection = null
}: GameBoardProps) => {
  const { containerSize } = useResponsive();
  const tileSize = Math.floor((containerSize - (GRID_SIZE + 1) * 8) / GRID_SIZE);

  // Create grid background
  const gridCells = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      gridCells.push(
        <div
          key={`${row}-${col}`}
          className="bg-gray-300 dark:bg-gray-600 rounded-lg transition-colors duration-300"
          style={{
            left: `${col * (tileSize + 8) + 8}px`,
            top: `${row * (tileSize + 8) + 8}px`,
            width: `${tileSize}px`,
            height: `${tileSize}px`,
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
    
    const baseClasses = 'absolute inset-0 pointer-events-none transition-all duration-200 rounded-xl';
    const directionClasses = {
      up: 'bg-gradient-to-t from-transparent via-blue-200/30 to-blue-400/50 dark:via-blue-400/30 dark:to-blue-500/50',
      down: 'bg-gradient-to-b from-transparent via-blue-200/30 to-blue-400/50 dark:via-blue-400/30 dark:to-blue-500/50',
      left: 'bg-gradient-to-l from-transparent via-blue-200/30 to-blue-400/50 dark:via-blue-400/30 dark:to-blue-500/50',
      right: 'bg-gradient-to-r from-transparent via-blue-200/30 to-blue-400/50 dark:via-blue-400/30 dark:to-blue-500/50'
    };
    
    return `${baseClasses} ${directionClasses[touchDirection]}`;
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative bg-gray-400 dark:bg-gray-700 rounded-xl p-2 touch-none select-none transition-all duration-300 ${
          isSwipeActive ? 'scale-[1.02] shadow-lg dark:shadow-gray-900/50' : ''
        }`}
        style={{
          width: `${containerSize}px`,
          height: `${containerSize}px`,
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
        {gridCells.map((cell, index) => (
          <div key={index} className="absolute">
            {cell}
          </div>
        ))}
        
        {/* Tiles */}
        {tiles.map((tile) => (
          <Tile key={tile.id} tile={tile} size={tileSize} />
        ))}
      </div>
      
      {/* Touch instruction for mobile */}
      <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400 sm:hidden transition-colors duration-300">
        <p>Swipe to move tiles</p>
      </div>
    </div>
  );
};