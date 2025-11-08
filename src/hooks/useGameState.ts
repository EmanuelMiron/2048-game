import { useState, useCallback, useEffect } from 'react';
import { GameState, GameHistory, Direction, Tile } from '../types/game';
import { 
  initializeBoard, 
  move, 
  addRandomTile, 
  canMove, 
  canMoveInDirection,
  hasWon,
  cloneBoard 
} from '../utils/gameLogic';

const STORAGE_KEY = 'game2048';
const BEST_SCORE_KEY = 'game2048-best';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Try to load saved game
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        return {
          ...parsedState,
          bestScore: parseInt(localStorage.getItem(BEST_SCORE_KEY) || '0')
        };
      } catch {
        // If parsing fails, start new game
      }
    }
    
    return {
      board: initializeBoard(),
      score: 0,
      bestScore: parseInt(localStorage.getItem(BEST_SCORE_KEY) || '0'),
      gameStatus: 'playing' as const,
      hasWon: false,
      canUndo: false
    };
  });

  const [history, setHistory] = useState<GameHistory[]>([]);
  const [animatingTiles, setAnimatingTiles] = useState<Tile[]>([]);
  const [scoreIncrease, setScoreIncrease] = useState<number>(0);

  // Save game state to localStorage
  const saveGame = useCallback((state: GameState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      board: state.board,
      score: state.score,
      gameStatus: state.gameStatus,
      hasWon: state.hasWon,
      canUndo: state.canUndo
    }));
    
    if (state.score > state.bestScore) {
      localStorage.setItem(BEST_SCORE_KEY, state.score.toString());
    }
  }, []);

  // Save game whenever state changes
  useEffect(() => {
    saveGame(gameState);
  }, [gameState, saveGame]);

  const makeMove = useCallback((direction: Direction) => {
    if (gameState.gameStatus !== 'playing') return false;

    // Check if the move is valid before attempting it
    if (!canMoveInDirection(gameState.board, direction)) return false;

    // Save current state to history
    const currentHistory: GameHistory = {
      board: cloneBoard(gameState.board),
      score: gameState.score
    };

    const moveResult = move(gameState.board, direction);
    
    // This should always be true now due to pre-validation, but keep as safety check
    if (!moveResult.moved) return false;

    // Add new tile after successful move
    const boardWithNewTile = addRandomTile(moveResult.board);
    const newScore = gameState.score + moveResult.scoreIncrease;
    const newBestScore = Math.max(gameState.bestScore, newScore);

    // Check game status
    const playerHasWon = hasWon(boardWithNewTile);
    const gameOver = !canMove(boardWithNewTile);
    
    let newGameStatus: 'playing' | 'won' | 'lost' = 'playing';
    if (playerHasWon && !gameState.hasWon) {
      newGameStatus = 'won';
    } else if (gameOver) {
      newGameStatus = 'lost';
    }

    // Update state
    setGameState(prev => ({
      ...prev,
      board: boardWithNewTile,
      score: newScore,
      bestScore: newBestScore,
      gameStatus: newGameStatus,
      hasWon: prev.hasWon || playerHasWon,
      canUndo: true
    }));

    // Update history (keep last 1 move for undo)
    setHistory([currentHistory]);
    
    // Set animations
    setAnimatingTiles(moveResult.mergedTiles);
    setScoreIncrease(moveResult.scoreIncrease);

    // Clear animations after delay
    setTimeout(() => {
      setAnimatingTiles([]);
      setScoreIncrease(0);
    }, 300);

    return true;
  }, [gameState]);

  const undoMove = useCallback(() => {
    if (!gameState.canUndo || history.length === 0) return;

    const lastState = history[0];
    setGameState(prev => ({
      ...prev,
      board: lastState.board,
      score: lastState.score,
      gameStatus: 'playing',
      canUndo: false
    }));

    setHistory([]);
  }, [gameState.canUndo, history]);

  const restartGame = useCallback(() => {
    const newState: GameState = {
      board: initializeBoard(),
      score: 0,
      bestScore: gameState.bestScore,
      gameStatus: 'playing',
      hasWon: false,
      canUndo: false
    };
    
    setGameState(newState);
    setHistory([]);
    setAnimatingTiles([]);
    setScoreIncrease(0);
  }, [gameState.bestScore]);

  const continueGame = useCallback(() => {
    if (gameState.gameStatus === 'won') {
      setGameState(prev => ({
        ...prev,
        gameStatus: 'playing'
      }));
    }
  }, [gameState.gameStatus]);

  return {
    gameState,
    makeMove,
    undoMove,
    restartGame,
    continueGame,
    animatingTiles,
    scoreIncrease
  };
};