'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

import type { GameState, Tetromino } from '@/app/types/tetris';
import {
  createEmptyBoard,
  getRandomTetromino,
  checkCollision,
  mergePieceToBoard,
  clearLines,
  calculateScore,
  rotatePiece,
} from '@/app/utils/tetris';
import { INITIAL_DROP_SPEED } from '@/app/constants/tetris';

export function useTetrisGame() {
  const [gameState, setGameState] = useState<GameState>(() => ({
    board: createEmptyBoard(),
    currentPiece: getRandomTetromino(),
    nextPiece: getRandomTetromino(),
    score: 0,
    gameOver: false,
    isPaused: false,
  }));

  const dropSpeedRef = useRef(INITIAL_DROP_SPEED);

  const movePiece = useCallback((offsetX: number, offsetY: number) => {
    setGameState(prev => {
      if (prev.gameOver || prev.isPaused || !prev.currentPiece) return prev;

      const canMove = !checkCollision(prev.currentPiece, prev.board, offsetX, offsetY);

      if (canMove) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            position: {
              x: prev.currentPiece.position.x + offsetX,
              y: prev.currentPiece.position.y + offsetY,
            },
          },
        };
      }

      // If moving down and cannot move, lock the piece
      if (offsetY > 0) {
        const mergedBoard = mergePieceToBoard(prev.currentPiece, prev.board);
        const { newBoard, linesCleared } = clearLines(mergedBoard);
        const newScore = calculateScore(linesCleared, prev.score);

        // Check if game over (new piece collides immediately)
        const newCurrentPiece = prev.nextPiece;
        const newNextPiece = getRandomTetromino();
        const isGameOver = newCurrentPiece ? checkCollision(newCurrentPiece, newBoard) : false;

        return {
          ...prev,
          board: newBoard,
          currentPiece: isGameOver ? null : newCurrentPiece,
          nextPiece: newNextPiece,
          score: newScore,
          gameOver: isGameOver,
        };
      }

      return prev;
    });
  }, []);

  const rotate = useCallback(() => {
    setGameState(prev => {
      if (prev.gameOver || prev.isPaused || !prev.currentPiece) return prev;

      const rotated = rotatePiece(prev.currentPiece);
      const canRotate = !checkCollision(rotated, prev.board);

      if (canRotate) {
        return { ...prev, currentPiece: rotated };
      }

      return prev;
    });
  }, []);

  const hardDrop = useCallback(() => {
    setGameState(prev => {
      if (prev.gameOver || prev.isPaused || !prev.currentPiece) return prev;

      let piece = prev.currentPiece;
      let dropDistance = 0;

      while (!checkCollision(piece, prev.board, 0, 1)) {
        piece = {
          ...piece,
          position: { x: piece.position.x, y: piece.position.y + 1 },
        };
        dropDistance++;
      }

      const mergedBoard = mergePieceToBoard(piece, prev.board);
      const { newBoard, linesCleared } = clearLines(mergedBoard);
      const newScore = calculateScore(linesCleared, prev.score) + dropDistance * 2;

      const newCurrentPiece = prev.nextPiece;
      const newNextPiece = getRandomTetromino();
      const isGameOver = newCurrentPiece ? checkCollision(newCurrentPiece, newBoard) : false;

      return {
        ...prev,
        board: newBoard,
        currentPiece: isGameOver ? null : newCurrentPiece,
        nextPiece: newNextPiece,
        score: newScore,
        gameOver: isGameOver,
      };
    });
  }, []);

  const togglePause = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      board: createEmptyBoard(),
      currentPiece: getRandomTetromino(),
      nextPiece: getRandomTetromino(),
      score: 0,
      gameOver: false,
      isPaused: false,
    });
    dropSpeedRef.current = INITIAL_DROP_SPEED;
  }, []);

  // Auto drop piece
  useEffect(() => {
    if (gameState.gameOver || gameState.isPaused) return;

    const interval = setInterval(() => {
      movePiece(0, 1);
    }, dropSpeedRef.current);

    return () => clearInterval(interval);
  }, [gameState.gameOver, gameState.isPaused, movePiece]);

  return {
    gameState,
    movePiece,
    rotate,
    hardDrop,
    togglePause,
    resetGame,
  };
}
