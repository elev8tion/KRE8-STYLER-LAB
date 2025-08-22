'use client';

import React, { useState, useEffect } from 'react';

interface PlacementMarkerProps {
  initialSize?: number;
  onPositionChange?: (position: { x: number; y: number; size: number }) => void;
  label?: string;
}

export default function PlacementMarker({ 
  initialSize = 119, 
  onPositionChange,
  label = "Drag me to desired position"
}: PlacementMarkerProps) {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showInfo, setShowInfo] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        setPosition({ x: newX, y: newY });
        
        if (onPositionChange) {
          onPositionChange({ x: newX, y: newY, size });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, size, onPositionChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleSizeChange = (delta: number) => {
    const newSize = Math.max(50, Math.min(500, size + delta));
    setSize(newSize);
    if (onPositionChange) {
      onPositionChange({ x: position.x, y: position.y, size: newSize });
    }
  };

  return (
    <>
      {/* Main Marker */}
      <div
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          width: size,
          height: size,
          backgroundColor: 'rgba(0, 221, 255, 0.3)',
          border: '3px solid #00ddff',
          borderRadius: '8px',
          cursor: isDragging ? 'grabbing' : 'grab',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          transition: isDragging ? 'none' : 'box-shadow 0.3s ease',
          boxShadow: isDragging 
            ? '0 0 30px rgba(0, 221, 255, 0.8), inset 0 0 20px rgba(255, 0, 222, 0.3)' 
            : '0 0 15px rgba(0, 221, 255, 0.5)'
        }}
        onMouseDown={handleMouseDown}
      >
        <div style={{ 
          color: '#ffffff', 
          fontSize: '12px', 
          textAlign: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: '4px 8px',
          borderRadius: '4px',
          userSelect: 'none',
          pointerEvents: 'none'
        }}>
          {label}
          <br />
          {size}x{size}px
        </div>
      </div>

      {/* Position Info Panel - Minimal and Collapsible */}
      {showInfo && (
        <div style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          border: '1px solid rgba(0, 221, 255, 0.5)',
          borderRadius: '8px',
          padding: '12px',
          color: '#ffffff',
          fontSize: '12px',
          zIndex: 10001,
          maxWidth: '200px',
          boxShadow: '0 0 10px rgba(0, 221, 255, 0.3)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <span style={{ 
              color: '#00ddff',
              fontSize: '11px',
              fontWeight: 'bold'
            }}>
              Position Info
            </span>
            <button
              onClick={() => setShowInfo(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ff00de',
                fontSize: '16px',
                cursor: 'pointer',
                padding: '0',
                lineHeight: '1'
              }}
            >
              ×
            </button>
          </div>
          
          <div style={{ lineHeight: '1.4', fontSize: '11px' }}>
            <div style={{ color: '#00ff77' }}>
              X: {position.x} | Y: {position.y}
            </div>
            <div style={{ color: '#00ff77' }}>
              Size: {size}px
            </div>
            
            <div style={{ marginTop: '8px', display: 'flex', gap: '4px' }}>
              <button
                onClick={() => handleSizeChange(-10)}
                style={{
                  flex: 1,
                  padding: '4px',
                  backgroundColor: 'rgba(255, 0, 222, 0.2)',
                  border: '1px solid #ff00de',
                  borderRadius: '4px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '10px'
                }}
              >
                -
              </button>
              <button
                onClick={() => handleSizeChange(10)}
                style={{
                  flex: 1,
                  padding: '4px',
                  backgroundColor: 'rgba(0, 221, 255, 0.2)',
                  border: '1px solid #00ddff',
                  borderRadius: '4px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '10px'
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Info Button (when hidden) - Small and out of the way */}
      {!showInfo && (
        <button
          onClick={() => setShowInfo(true)}
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            border: '1px solid rgba(0, 221, 255, 0.5)',
            borderRadius: '6px',
            padding: '6px 10px',
            color: '#00ddff',
            fontSize: '11px',
            cursor: 'pointer',
            zIndex: 10001
          }}
        >
          📍
        </button>
      )}
    </>
  );
}