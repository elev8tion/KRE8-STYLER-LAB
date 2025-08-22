'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DraggableMarkerProps {
  onPositionChange?: (x: number, y: number, width: number, height: number) => void;
}

export default function DraggableMarker({ onPositionChange }: DraggableMarkerProps) {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 100, height: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      } else if (isResizing) {
        const newWidth = resizeStart.width + (e.clientX - resizeStart.x);
        const newHeight = resizeStart.height + (e.clientY - resizeStart.y);
        setSize({
          width: Math.max(50, newWidth),
          height: Math.max(50, newHeight)
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      if (onPositionChange) {
        onPositionChange(position.x, position.y, size.width, size.height);
      }
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart, position, size, onPositionChange]);

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      width: size.width,
      height: size.height,
      x: e.clientX,
      y: e.clientY
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        border: '3px solid #00ffff',
        backgroundColor: 'rgba(0, 255, 255, 0.1)',
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: 9999,
        boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)'
      }}
      onMouseDown={handleDragStart}
    >
      {/* Center crosshair */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '20px',
          height: '20px',
          pointerEvents: 'none'
        }}
      >
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '1px',
          backgroundColor: '#00ffff'
        }} />
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: '1px',
          backgroundColor: '#00ffff'
        }} />
      </div>

      {/* Size label */}
      <div
        style={{
          position: 'absolute',
          top: '-25px',
          left: '0',
          color: '#00ffff',
          fontSize: '12px',
          fontFamily: 'monospace',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '2px 6px',
          borderRadius: '3px',
          pointerEvents: 'none'
        }}
      >
        {size.width} x {size.height}px
      </div>

      {/* Position label */}
      <div
        style={{
          position: 'absolute',
          bottom: '-25px',
          left: '0',
          color: '#00ffff',
          fontSize: '12px',
          fontFamily: 'monospace',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '2px 6px',
          borderRadius: '3px',
          pointerEvents: 'none'
        }}
      >
        x: {position.x}, y: {position.y}
      </div>

      {/* Resize handle */}
      <div
        style={{
          position: 'absolute',
          bottom: '-5px',
          right: '-5px',
          width: '15px',
          height: '15px',
          backgroundColor: '#00ffff',
          cursor: 'nwse-resize',
          borderRadius: '2px'
        }}
        onMouseDown={handleResizeStart}
      />
    </div>
  );
}