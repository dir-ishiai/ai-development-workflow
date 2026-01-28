'use client';

import { useTetrisGame } from '@/app/hooks/useTetrisGame';
import { useKeyboardControls } from '@/app/hooks/useKeyboardControls';
import { GameBoard } from '@/app/components/tetris/GameBoard';
import { NextPiece } from '@/app/components/tetris/NextPiece';
import { ScoreDisplay } from '@/app/components/tetris/ScoreDisplay';
import { Controls } from '@/app/components/tetris/Controls';

export default function TetrisPage() {
  const { gameState, movePiece, rotate, hardDrop, togglePause, resetGame } = useTetrisGame();

  useKeyboardControls({
    onMoveLeft: () => movePiece(-1, 0),
    onMoveRight: () => movePiece(1, 0),
    onMoveDown: () => movePiece(0, 1),
    onRotate: rotate,
    onHardDrop: hardDrop,
    onPause: togglePause,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">Tetris</h1>
          <p className="text-slate-400">Use arrow keys to play, Space for hard drop, P to pause</p>
        </div>

        {/* Game Container */}
        <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
          {/* Main Game Board */}
          <div className="flex-shrink-0">
            <GameBoard board={gameState.board} currentPiece={gameState.currentPiece} />
          </div>

          {/* Side Panel */}
          <div className="space-y-4 w-full lg:w-64">
            <ScoreDisplay score={gameState.score} />
            <NextPiece piece={gameState.nextPiece} />
            <Controls />

            {/* Game Controls */}
            <div className="space-y-3">
              {gameState.gameOver && (
                <div className="bg-red-600 text-white rounded-lg p-4 text-center font-semibold">
                  Game Over!
                </div>
              )}

              {gameState.isPaused && !gameState.gameOver && (
                <div className="bg-yellow-600 text-white rounded-lg p-4 text-center font-semibold">
                  Paused
                </div>
              )}

              <button
                onClick={resetGame}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
              >
                {gameState.gameOver ? 'New Game' : 'Restart'}
              </button>

              {!gameState.gameOver && (
                <button
                  onClick={togglePause}
                  className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-semibold"
                >
                  {gameState.isPaused ? 'Resume' : 'Pause'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Instructions */}
        <div className="mt-8 text-center text-slate-400 text-sm lg:hidden">
          <p>This game is best played with a keyboard</p>
        </div>
      </div>
    </div>
  );
}
