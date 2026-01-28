'use client';

import { useEffect } from 'react';

interface KeyboardControls {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  onPause?: () => void;
}

export function useKeyboardControls({
  onMoveLeft,
  onMoveRight,
  onMoveDown,
  onRotate,
  onHardDrop,
  onPause,
}: KeyboardControls) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default for arrow keys and space to avoid page scrolling
      if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' '].includes(event.key)) {
        event.preventDefault();
      }

      switch (event.key) {
        case 'ArrowLeft':
          onMoveLeft();
          break;
        case 'ArrowRight':
          onMoveRight();
          break;
        case 'ArrowDown':
          onMoveDown();
          break;
        case 'ArrowUp':
          onRotate();
          break;
        case ' ':
          onHardDrop();
          break;
        case 'p':
        case 'P':
          onPause?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onMoveLeft, onMoveRight, onMoveDown, onRotate, onHardDrop, onPause]);
}
