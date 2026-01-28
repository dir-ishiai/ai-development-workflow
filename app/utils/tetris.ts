import type { Tetromino, GameBoard, TetrominoType } from '@/app/types/tetris';
import { TETROMINO_SHAPES, TETROMINO_COLORS, BOARD_WIDTH, BOARD_HEIGHT } from '@/app/constants/tetris';

export function createEmptyBoard(): GameBoard {
  return Array(BOARD_HEIGHT)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(null));
}

export function createTetromino(type: TetrominoType): Tetromino {
  return {
    type,
    shape: TETROMINO_SHAPES[type],
    color: TETROMINO_COLORS[type],
    position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
  };
}

export function getRandomTetromino(): Tetromino {
  const types: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  const randomType = types[Math.floor(Math.random() * types.length)];
  return createTetromino(randomType);
}

export function rotatePiece(piece: Tetromino): Tetromino {
  const size = piece.shape.length;
  const rotated = Array(size)
    .fill(null)
    .map(() => Array(size).fill(0));

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      rotated[x][size - 1 - y] = piece.shape[y][x];
    }
  }

  return { ...piece, shape: rotated };
}

export function checkCollision(
  piece: Tetromino,
  board: GameBoard,
  offsetX = 0,
  offsetY = 0
): boolean {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const newX = piece.position.x + x + offsetX;
        const newY = piece.position.y + y + offsetY;

        // Check boundaries
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return true;
        }

        // Check collision with existing blocks
        if (newY >= 0 && board[newY][newX]) {
          return true;
        }
      }
    }
  }
  return false;
}

export function mergePieceToBoard(piece: Tetromino, board: GameBoard): GameBoard {
  const newBoard = board.map(row => [...row]);

  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardY = piece.position.y + y;
        const boardX = piece.position.x + x;
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = piece.color;
        }
      }
    }
  }

  return newBoard;
}

export function clearLines(board: GameBoard): { newBoard: GameBoard; linesCleared: number } {
  let linesCleared = 0;
  const newBoard: GameBoard = [];

  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    if (board[y].every(cell => cell !== null)) {
      linesCleared++;
    } else {
      newBoard.unshift(board[y]);
    }
  }

  // Add new empty lines at the top
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null));
  }

  return { newBoard, linesCleared };
}

export function calculateScore(linesCleared: number, currentScore: number): number {
  const points = [0, 100, 300, 500, 800];
  return currentScore + (points[linesCleared] || 0);
}
