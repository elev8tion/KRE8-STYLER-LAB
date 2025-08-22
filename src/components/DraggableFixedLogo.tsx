'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { GripVertical, Maximize2, Minimize2 } from 'lucide-react';

export default function DraggableFixedLogo() {
  const [position, setPosition] = useState({ x: 400, y: 200 }); // Start in center-ish, floating
  const [size, setSize] = useState(109);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ size: 109, x: 0, y: 0 });
  const [lastClickTime, setLastClickTime] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      }
      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const delta = Math.max(deltaX, deltaY);
        setSize(Math.max(50, Math.min(300, resizeStart.size + delta)));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      // Log position and size for saving
      console.log('Logo Position & Size:', { x: position.x, y: position.y, size });
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart, position, size]);

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      size: size,
      x: e.clientX,
      y: e.clientY
    });
  };

  const savePosition = () => {
    const config = { x: position.x, y: position.y, size };
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    console.log('Saved Logo Config:', config);
    alert(`Logo position saved! x: ${position.x}, y: ${position.y}, size: ${size}`);
  };

  const handleDoubleClick = () => {
    const currentTime = Date.now();
    if (currentTime - lastClickTime < 500) { // Double-click detected
      savePosition();
    }
    setLastClickTime(currentTime);
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size}px`,
        height: `${size}px`,
        zIndex: 99999,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      className="group"
    >
      {/* Control Bar */}
      <div 
        className="absolute -top-8 left-0 right-0 bg-black/90 border border-cyan-500/50 rounded-t-lg px-2 py-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        onMouseDown={handleDragStart}
      >
        <GripVertical className="w-4 h-4 text-cyan-400 mr-2" />
        <span className="text-xs text-cyan-300 font-semibold">Drag to move • Double-click to save</span>
      </div>

      {/* Logo */}
      <div className="relative w-full h-full" onClick={handleDoubleClick}>
        <Image
          src="/kre8-logo.svg"
          alt="KRE8 STYLER Logo"
          width={size}
          height={size}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 20px rgba(0, 221, 255, 0.8))',
          }}
        />
        
        {/* Resize Handle */}
        <div
          className="absolute bottom-0 right-0 w-4 h-4 bg-cyan-500/50 rounded-tl-lg cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity"
          onMouseDown={handleResizeStart}
        />
      </div>

      {/* Size indicator */}
      <div className="absolute -bottom-6 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs text-cyan-400 bg-black/90 px-2 py-0.5 rounded">
          {size}px
        </span>
      </div>
    </div>
  );
}