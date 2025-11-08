import { useEffect, useState } from 'react';
import { Tile as TileType } from '../types/game';
import { getTileColor } from '../utils/gameLogic';

interface TileProps {
  tile: TileType;
  size: number;
}

export const Tile: React.FC<TileProps> = ({ tile, size }) => {
  const [isVisible, setIsVisible] = useState(!tile.isNew);
  const [isMerging, setIsMerging] = useState(false);

  useEffect(() => {
    if (tile.isNew) {
      // Delay to allow for positioning, then animate in
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [tile.isNew]);

  useEffect(() => {
    if (tile.isMerged) {
      setIsMerging(true);
      const timer = setTimeout(() => {
        setIsMerging(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [tile.isMerged]);

  const position = {
    left: `${tile.col * (size + 8) + 8}px`,
    top: `${tile.row * (size + 8) + 8}px`,
    width: `${size}px`,
    height: `${size}px`,
  };

  const fontSize = tile.value >= 1000 ? 'text-xl' : tile.value >= 100 ? 'text-2xl' : 'text-3xl';
  const fontWeight = 'font-bold';

  return (
    <div
      className={`
        absolute flex items-center justify-center rounded-lg shadow-lg
        transition-all duration-300 ease-in-out
        ${getTileColor(tile.value)}
        ${fontSize} ${fontWeight}
        ${isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
        ${isMerging ? 'scale-110' : 'scale-100'}
        ${tile.isNew ? 'animate-pulse' : ''}
      `}
      style={position}
      role="gridcell"
      aria-label={`Tile with value ${tile.value}`}
    >
      {tile.value}
    </div>
  );
};