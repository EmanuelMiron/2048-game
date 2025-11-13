import { useEffect, useState } from 'react';
import { Tile as TileType } from '../types/game';
import { getTileColor } from '../utils/gameLogic';

const TILE_VALUE_KEYS = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];

const getTileTextColorVar = (value: number): string => {
  const key = TILE_VALUE_KEYS.includes(value) ? value : 'super';
  return `var(--tile-${key}-foreground)`;
};

interface TileProps {
  tile: TileType;
  size: number;
  gap: number;
}

export const Tile: React.FC<TileProps> = ({ tile, size, gap }) => {
  const [isVisible, setIsVisible] = useState(!tile.isNew);
  const [isMerging, setIsMerging] = useState(false);

  useEffect(() => {
    if (tile.isNew) {
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
    left: `${tile.col * (size + gap) + gap}px`,
    top: `${tile.row * (size + gap) + gap}px`,
    width: `${size}px`,
    height: `${size}px`,
  };

  const fontSize = tile.value >= 1000 ? 'text-xl' : tile.value >= 100 ? 'text-2xl' : 'text-5xl';
  const fontWeight = 'font-bold';
  const textColor = getTileTextColorVar(tile.value);

  return (
    <div
      className={`
        absolute flex items-center justify-center rounded-xl
        transition-all duration-400 ease-out
        ${getTileColor(tile.value)}
        ${fontSize} ${fontWeight} font-serif tabular-nums
        ${isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
        ${isMerging ? 'scale-105' : 'scale-100'}
        border border-black/5 dark:border-black/20
        border-b-8
      `}
      style={{
        ...position,
        transformOrigin: 'center',
        transition: 'all 380ms cubic-bezier(0.2, 0.9, 0.25, 1)',
        color: textColor
      }}
      role="gridcell"
      aria-label={`Tile with value ${tile.value}`}
    >
      {tile.value}
    </div>
  );
};
