'use client';

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const MagneticCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const reticuleRef = useRef<HTMLDivElement>(null);
  const [isSnapped, setIsSnapped] = useState(false);
  const [snapTarget, setSnapTarget] = useState<HTMLElement | null>(null);
  
  useEffect(() => {
    const cursor = cursorRef.current;
    const reticule = reticuleRef.current;
    if (!cursor || !reticule) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Check if hovering over magnetic elements
      const target = e.target as HTMLElement;
      const magneticElement = target.closest('[data-magnetic]');
      
      if (magneticElement && magneticElement instanceof HTMLElement) {
        const rect = magneticElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distX = mouseX - centerX;
        const distY = mouseY - centerY;
        const distance = Math.sqrt(distX * distX + distY * distY);
        
        const magnetRadius = 80; // Snap radius
        if (distance < magnetRadius) {
          // SNAP to center of element
          targetX = centerX;
          targetY = centerY;
          setIsSnapped(true);
          setSnapTarget(magneticElement);
        } else {
          targetX = mouseX;
          targetY = mouseY;
          setIsSnapped(false);
          setSnapTarget(null);
        }
      } else {
        targetX = mouseX;
        targetY = mouseY;
        setIsSnapped(false);
        setSnapTarget(null);
      }
    };

    const animate = () => {
      // Instant snap or smooth follow
      if (isSnapped) {
        // Instant snap to target
        cursorX = targetX;
        cursorY = targetY;
      } else {
        // Smooth movement when not snapped
        cursorX += (targetX - cursorX) * 0.2;
        cursorY += (targetY - cursorY) * 0.2;
      }
      
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      reticule.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

      requestAnimationFrame(animate);
    };

    const handleMouseEnter = () => {
      cursor.style.opacity = '1';
      reticule.style.opacity = '1';
    };

    const handleMouseLeave = () => {
      cursor.style.opacity = '0';
      reticule.style.opacity = '0';
    };

    // Add click handling for snapped elements
    const handleClick = (e: MouseEvent) => {
      if (snapTarget) {
        snapTarget.click();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('click', handleClick);
    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('click', handleClick);
    };
  }, [isSnapped, snapTarget]);

  return (
    <>
      <GlobalCursorHide />
      <StyledWrapper>
        <div 
          ref={cursorRef} 
          className={`cursor ${isSnapped ? 'snapped' : ''}`}
        >
          <div className="cursor-core" />
          <div className="cursor-ring" />
        </div>
        <div 
          ref={reticuleRef} 
          className={`reticule ${isSnapped ? 'snapped' : ''}`}
        >
          <div className="corner top-left" />
          <div className="corner top-right" />
          <div className="corner bottom-left" />
          <div className="corner bottom-right" />
        </div>
      </StyledWrapper>
    </>
  );
};

const GlobalCursorHide = styled.div`
  * {
    cursor: none !important;
  }
`;

const StyledWrapper = styled.div`
  .cursor, .reticule {
    position: fixed;
    pointer-events: none;
    z-index: 99999;
    mix-blend-mode: screen;
    opacity: 0;
    transition: opacity 0.3s ease;
    top: 0;
    left: 0;
    will-change: transform;
  }

  .cursor {
    width: 8px;
    height: 8px;
    margin-left: -4px;
    margin-top: -4px;
  }

  .cursor-core {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, #00ddff 0%, transparent 70%);
    border-radius: 50%;
    box-shadow: 
      0 0 20px #00ddff,
      0 0 40px rgba(0, 221, 255, 0.5);
    animation: pulse 2s infinite ease-in-out;
    transition: all 0.15s ease;
  }

  .cursor-ring {
    position: absolute;
    width: 24px;
    height: 24px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid rgba(0, 221, 255, 0.5);
    border-radius: 50%;
    transition: all 0.15s ease;
  }

  .cursor.snapped .cursor-core {
    background: radial-gradient(circle, #ff00de 0%, transparent 70%);
    box-shadow: 
      0 0 30px #ff00de,
      0 0 60px rgba(255, 0, 222, 0.5);
    transform: scale(1.5);
  }

  .cursor.snapped .cursor-ring {
    width: 48px;
    height: 48px;
    border-color: rgba(255, 0, 222, 0.8);
    border-width: 2px;
    animation: rotate 1s linear infinite;
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
  }

  @keyframes rotate {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  .reticule {
    width: 40px;
    height: 40px;
    margin-left: -20px;
    margin-top: -20px;
    transition: all 0.15s ease;
  }

  .reticule.snapped {
    width: 80px;
    height: 80px;
    margin-left: -40px;
    margin-top: -40px;
  }

  .corner {
    position: absolute;
    width: 8px;
    height: 8px;
    border: 1px solid rgba(0, 221, 255, 0.3);
    transition: all 0.15s ease;
  }

  .corner.top-left {
    top: 0;
    left: 0;
    border-right: none;
    border-bottom: none;
  }

  .corner.top-right {
    top: 0;
    right: 0;
    border-left: none;
    border-bottom: none;
  }

  .corner.bottom-left {
    bottom: 0;
    left: 0;
    border-right: none;
    border-top: none;
  }

  .corner.bottom-right {
    bottom: 0;
    right: 0;
    border-left: none;
    border-top: none;
  }

  .reticule.snapped .corner {
    border-color: rgba(255, 0, 222, 0.8);
    width: 16px;
    height: 16px;
    border-width: 2px;
  }
`;

export default MagneticCursor;