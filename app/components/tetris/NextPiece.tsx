'use client';

import type { Tetromino } from '@/app/types/tetris';

interface NextPieceProps {
  piece: Tetromino | null;
}

export function NextPiece({ piece }: NextPieceProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 border-2 border-slate-700">
      <h3 className="text-white text-sm font-semibold mb-3 text-center">Next</h3>
      <div className="flex items-center justify-center bg-slate-900 rounded p-2 min-h-[100px]">
        {piece ? (
          <div className="grid gap-[1px]" style={{ gridTemplateColumns: `repeat(${piece.shape[0].length}, 1fr)` }}>
            {piece.shape.map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${y}-${x}`}
                  className="w-5 h-5 border border-slate-800"
                  style={{
                    backgroundColor: cell ? piece.color : 'transparent',
                  }}
                />
              ))
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
