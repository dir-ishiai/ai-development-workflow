export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export interface Position {
  x: number;
  y: number;
}

export interface Tetromino {
  type: TetrominoType;
  shape: number[][];
  color: string;
  position: Position;
}

export type GameBoard = (string | null)[][];

export interface GameState {
  board: GameBoard;
  currentPiece: Tetromino | null;
  nextPiece: Tetromino | null;
  score: number;
  gameOver: boolean;
  isPaused: boolean;
}
