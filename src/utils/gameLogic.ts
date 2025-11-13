import { Tile, Direction, MoveResult, Position } from '../types/game';

export const GRID_SIZE = 4;
export const WIN_TILE = 2048;

// Generate unique ID for tiles
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// Create empty board
export const createEmptyBoard = (): (Tile | null)[][] => {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
};

// Get empty cells
export const getEmptyCells = (board: (Tile | null)[][]): Position[] => {
  const emptyCells: Position[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!board[row][col]) {
        emptyCells.push({ row, col });
      }
    }
  }
  return emptyCells;
};

// Add random tile (90% chance of 2, 10% chance of 4)
export const addRandomTile = (board: (Tile | null)[][]): (Tile | null)[][] => {
  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) return board;

  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  
  const newBoard = board.map(row => [...row]);
  newBoard[randomCell.row][randomCell.col] = {
    id: generateId(),
    value,
    row: randomCell.row,
    col: randomCell.col,
    isNew: true
  };

  return newBoard;
};

// Initialize game with two random tiles
export const initializeBoard = (): (Tile | null)[][] => {
  let board = createEmptyBoard();
  board = addRandomTile(board);
  board = addRandomTile(board);
  return board;
};

// Deep clone board
export const cloneBoard = (board: (Tile | null)[][]): (Tile | null)[][] => {
  return board.map(row => 
    row.map(tile => tile ? { ...tile, isNew: false, isMerged: false } : null)
  );
};

// Check if boards are equal
export const boardsEqual = (board1: (Tile | null)[][], board2: (Tile | null)[][]): boolean => {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const tile1 = board1[row][col];
      const tile2 = board2[row][col];
      
      if (!tile1 && !tile2) continue;
      if (!tile1 || !tile2) return false;
      if (tile1.value !== tile2.value) return false;
    }
  }
  return true;
};

// Move and merge tiles in a line
const processLine = (line: (Tile | null)[]): { 
  newLine: (Tile | null)[], 
  scoreIncrease: number,
  mergedTiles: Tile[]
} => {
  // Filter out null values and reset merge status
  const tiles = line.filter(tile => tile !== null).map(tile => ({
    ...tile!,
    isMerged: false
  }));
  
  const newLine: (Tile | null)[] = Array(GRID_SIZE).fill(null);
  let scoreIncrease = 0;
  const mergedTiles: Tile[] = [];
  let position = 0;

  for (let i = 0; i < tiles.length; i++) {
    const currentTile = tiles[i];
    
    // Check if we can merge with the next tile
    if (i < tiles.length - 1 && 
        tiles[i + 1].value === currentTile.value && 
        !currentTile.isMerged && 
        !tiles[i + 1].isMerged) {
      
      // Merge tiles
      const mergedValue = currentTile.value * 2;
      const mergedTile: Tile = {
        id: generateId(),
        value: mergedValue,
        row: currentTile.row,
        col: currentTile.col,
        isMerged: true,
        mergedFrom: [currentTile, tiles[i + 1]]
      };
      
      newLine[position] = mergedTile;
      mergedTiles.push(mergedTile);
      scoreIncrease += mergedValue;
      position++;
      i++; // Skip next tile as it's been merged
    } else {
      // Just move the tile
      newLine[position] = { ...currentTile };
      position++;
    }
  }

  return { newLine, scoreIncrease, mergedTiles };
};

// Move tiles in specified direction
export const move = (board: (Tile | null)[][], direction: Direction): MoveResult => {
  const newBoard = cloneBoard(board);
  let totalScoreIncrease = 0;
  let moved = false;
  const allMergedTiles: Tile[] = [];

  // Update tile positions based on direction
  const updateTilePositions = (tiles: (Tile | null)[], lineIndex: number, isVertical: boolean) => {
    return tiles.map((tile, index) => {
      if (!tile) return null;
      
      const newRow = isVertical ? index : lineIndex;
      const newCol = isVertical ? lineIndex : index;
      
      if (tile.row !== newRow || tile.col !== newCol) {
        moved = true;
      }
      
      return {
        ...tile,
        row: newRow,
        col: newCol
      };
    });
  };

  for (let i = 0; i < GRID_SIZE; i++) {
    let line: (Tile | null)[];
    
    // Extract line based on direction
    switch (direction) {
      case 'left':
        line = newBoard[i];
        break;
      case 'right':
        line = [...newBoard[i]].reverse();
        break;
      case 'up':
        line = newBoard.map(row => row[i]);
        break;
      case 'down':
        line = newBoard.map(row => row[i]).reverse();
        break;
    }

    const { newLine, scoreIncrease, mergedTiles } = processLine(line);
    totalScoreIncrease += scoreIncrease;
    allMergedTiles.push(...mergedTiles);

    // Update positions and put line back
    const updatedLine = updateTilePositions(
      direction === 'right' || direction === 'down' ? newLine.reverse() : newLine,
      i,
      direction === 'up' || direction === 'down'
    );

    // Put the processed line back into the board
    switch (direction) {
      case 'left':
      case 'right':
        newBoard[i] = updatedLine;
        break;
      case 'up':
      case 'down':
        for (let j = 0; j < GRID_SIZE; j++) {
          newBoard[j][i] = updatedLine[j];
        }
        break;
    }
  }

  // If merges occurred (totalScoreIncrease > 0), this counts as a valid move
  // even if tiles didn't change positions significantly
  moved = moved || totalScoreIncrease > 0;

  return {
    board: newBoard,
    score: totalScoreIncrease,
    moved,
    mergedTiles: allMergedTiles,
    scoreIncrease: totalScoreIncrease
  };
};

// Simulate a move without actually changing the board
const simulateMove = (board: (Tile | null)[][], direction: Direction): boolean => {
  const testBoard = cloneBoard(board);
  const moveResult = move(testBoard, direction);
  return moveResult.moved;
};

// Check if a move in a specific direction is possible
export const canMoveLeft = (board: (Tile | null)[][]): boolean => {
  return simulateMove(board, 'left');
};

export const canMoveRight = (board: (Tile | null)[][]): boolean => {
  return simulateMove(board, 'right');
};

export const canMoveUp = (board: (Tile | null)[][]): boolean => {
  return simulateMove(board, 'up');
};

export const canMoveDown = (board: (Tile | null)[][]): boolean => {
  return simulateMove(board, 'down');
};

// Check if any moves are possible by testing all directions
export const canMove = (board: (Tile | null)[][]): boolean => {
  return canMoveLeft(board) || 
         canMoveRight(board) || 
         canMoveUp(board) || 
         canMoveDown(board);
};

// Check if a specific direction move is valid
export const canMoveInDirection = (board: (Tile | null)[][], direction: Direction): boolean => {
  switch (direction) {
    case 'left':
      return canMoveLeft(board);
    case 'right':
      return canMoveRight(board);
    case 'up':
      return canMoveUp(board);
    case 'down':
      return canMoveDown(board);
    default:
      return false;
  }
};

// Check if player has won (reached 2048)
export const hasWon = (board: (Tile | null)[][]): boolean => {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const tile = board[row][col];
      if (tile && tile.value >= WIN_TILE) {
        return true;
      }
    }
  }
  return false;
};

// Get tile color based on value with dark mode support
export const getTileColor = (value: number): string => {
  const base = 'transition-colors duration-300';
  const colors: { [key: number]: string } = {
    2: `bg-tile-2-light dark:bg-tile-2-dark ${base}`,
    4: `bg-tile-4-light dark:bg-tile-4-dark ${base}`,
    8: `bg-tile-8-light dark:bg-tile-8-dark ${base}`,
    16: `bg-tile-16-light dark:bg-tile-16-dark ${base}`,
    32: `bg-tile-32-light dark:bg-tile-32-dark ${base}`,
    64: `bg-tile-64-light dark:bg-tile-64-dark ${base}`,
    128: `bg-tile-128-light dark:bg-tile-128-dark ${base}`,
    256: `bg-tile-256-light dark:bg-tile-256-dark ${base}`,
    512: `bg-tile-512-light dark:bg-tile-512-dark ${base}`,
    1024: `bg-tile-1024-light dark:bg-tile-1024-dark ${base}`,
    2048: `bg-tile-2048-light dark:bg-tile-2048-dark ${base}`,
  };

  return colors[value] || `bg-tile-super-light dark:bg-tile-super-dark ${base}`;
};

// Format score with commas
export const formatScore = (score: number): string => {
  return score.toLocaleString();
};
