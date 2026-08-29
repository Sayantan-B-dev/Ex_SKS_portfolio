'use client';

import { useRef, useEffect } from 'react';

const CanvasCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    function onMove(e: MouseEvent) {
      dot!.style.left = `${e.clientX}px`;
      dot!.style.top = `${e.clientY}px`;
    }

    function onTouch(e: TouchEvent) {
      if (e.touches.length === 1) {
        dot!.style.left = `${e.touches[0].clientX}px`;
        dot!.style.top = `${e.touches[0].clientY}px`;
      }
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onTouch, { passive: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('touchmove', onTouch);
    };
  }, []);

  return <div ref={dotRef} className="cursor-dot" />;
};

export default CanvasCursor;
