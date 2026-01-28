'use client';

export function Controls() {
  return (
    <div className="bg-slate-800 rounded-lg p-4 border-2 border-slate-700">
      <h3 className="text-white text-sm font-semibold mb-3 text-center">Controls</h3>
      <div className="space-y-2 text-xs text-slate-300">
        <div className="flex justify-between">
          <span>Move:</span>
          <span className="font-mono">← →</span>
        </div>
        <div className="flex justify-between">
          <span>Rotate:</span>
          <span className="font-mono">↑</span>
        </div>
        <div className="flex justify-between">
          <span>Soft Drop:</span>
          <span className="font-mono">↓</span>
        </div>
        <div className="flex justify-between">
          <span>Hard Drop:</span>
          <span className="font-mono">Space</span>
        </div>
        <div className="flex justify-between">
          <span>Pause:</span>
          <span className="font-mono">P</span>
        </div>
      </div>
    </div>
  );
}
