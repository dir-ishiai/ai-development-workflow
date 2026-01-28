'use client';

interface ScoreDisplayProps {
  score: number;
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 border-2 border-slate-700">
      <h3 className="text-white text-sm font-semibold mb-2 text-center">Score</h3>
      <div className="text-3xl font-bold text-blue-400 text-center">{score}</div>
    </div>
  );
}
