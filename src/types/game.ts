export interface Tile {
  id: string;
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  isMerged?: boolean;
  mergedFrom?: Tile[];
}

export interface GameState {
  board: (Tile | null)[][];
  score: number;
  bestScore: number;
  gameStatus: 'playing' | 'won' | 'lost';
  hasWon: boolean;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface MoveResult {
  board: (Tile | null)[][];
  score: number;
  moved: boolean;
  mergedTiles: Tile[];
  scoreIncrease: number;
}

export interface Position {
  row: number;
  col: number;
}

export interface ParticleConfig {
  x: number;
  y: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
  life: number;
}