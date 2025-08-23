'use client';

import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

interface ParticleCardProps {
  text: string;
  color?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

const ParticleCard: React.FC<ParticleCardProps> = ({ 
  text, 
  color = '#00ffcc',
  icon,
  onClick 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const particlesRef = useRef<any[]>([]);
  const animationRef = useRef<number | undefined>();
  const textPointsRef = useRef<{x: number, y: number}[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = 180;
    canvas.height = 100;

    // Generate text points
    const fontSize = text.length > 10 ? 14 : 18;
    ctx.font = `bold ${fontSize}px monospace`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Measure text to ensure it fits
    const textMetrics = ctx.measureText(text.toUpperCase());
    const textWidth = textMetrics.width;
    
    // Clear and draw text to sample points
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Scale font if text is too wide
    if (textWidth > canvas.width - 20) {
      const scaleFactor = (canvas.width - 20) / textWidth;
      ctx.font = `bold ${Math.floor(fontSize * scaleFactor)}px monospace`;
    }
    
    ctx.fillText(text.toUpperCase(), canvas.width / 2, canvas.height / 2);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    textPointsRef.current = [];
    
    // Sample points from the text with very dense sampling for perfect visibility
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4;
        // Check alpha channel for text pixels
        if (imageData.data[index + 3] > 200) {
          textPointsRef.current.push({ x, y });
        }
      }
    }

    // Use ALL text points for perfect text formation
    particlesRef.current = [];
    
    if (textPointsRef.current.length > 0) {
      // Create a particle for every text point or subsample if too many
      const maxParticles = 500;
      const step = Math.max(1, Math.ceil(textPointsRef.current.length / maxParticles));
      
      for (let i = 0; i < textPointsRef.current.length; i += step) {
        const point = textPointsRef.current[i];
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          targetX: point.x,
          targetY: point.y,
          originX: Math.random() * canvas.width,
          originY: Math.random() * canvas.height,
          size: 1, // Uniform small size for crisp text
          speed: 0.12
        });
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach((particle) => {
        if (isHovered) {
          // Snap particles to exact text position for perfect formation
          const dx = particle.targetX - particle.x;
          const dy = particle.targetY - particle.y;
          
          // Fast snap to position
          if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
            particle.x += dx * particle.speed * 3;
            particle.y += dy * particle.speed * 3;
          } else {
            // Lock to exact position when close
            particle.x = particle.targetX;
            particle.y = particle.targetY;
          }
        } else {
          // Scatter particles randomly with floating motion
          particle.x += (particle.originX - particle.x) * particle.speed * 0.5;
          particle.y += (particle.originY - particle.y) * particle.speed * 0.5;
          
          // Random floating movement - less frequent
          if (Math.random() < 0.01) {
            particle.originX = Math.random() * canvas.width;
            particle.originY = Math.random() * canvas.height;
          }
        }

        // Draw particle - PERFECT visibility when forming text
        if (isHovered) {
          // Check if particle is at its target position
          const atTarget = Math.abs(particle.x - particle.targetX) < 1 && 
                          Math.abs(particle.y - particle.targetY) < 1;
          
          // Solid bright particles for perfect text visibility
          ctx.beginPath();
          ctx.fillStyle = atTarget ? color : `${color}DD`;
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Dimmer scattered particles
          ctx.beginPath();
          ctx.fillStyle = `${color}33`;
          ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [text, isHovered, color]);

  return (
    <StyledWrapper $color={color}>
      <div 
        className="card" 
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <canvas
          ref={canvasRef}
          className="particle-canvas"
          width={180}
          height={100}
        />
        {icon && (
          <div className="icon-container">
            {icon}
          </div>
        )}
        <div className="category-badge">
          {text}
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ $color: string }>`
  .card {
    width: 180px;
    height: 240px;
    position: relative;
    background: linear-gradient(135deg, 
      ${props => props.$color}11 0%, 
      ${props => props.$color}22 50%, 
      rgba(0,0,0,0.9) 100%);
    border: 1px solid ${props => props.$color}44;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 15px;
    transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    cursor: pointer;
    overflow: hidden;
    box-shadow: 
      0 0 20px ${props => props.$color}22,
      inset 0 0 20px ${props => props.$color}11;
  }

  .card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, ${props => props.$color}44, transparent);
    transition: left 0.5s;
  }

  .card:hover::before {
    left: 100%;
  }

  .particle-canvas {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .icon-container {
    position: absolute;
    top: 20px;
    display: grid;
    place-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: linear-gradient(135deg, 
      ${props => props.$color}33, 
      ${props => props.$color}66);
    border: 2px solid ${props => props.$color};
    color: white;
    z-index: 10;
    transition: all 0.3s ease;
  }

  .category-badge {
    position: absolute;
    bottom: 20px;
    font-size: 11px;
    letter-spacing: 2px;
    color: ${props => props.$color}88;
    text-transform: uppercase;
    font-weight: 600;
    text-shadow: 0 0 10px ${props => props.$color}44;
    font-family: 'Fira Code', monospace;
    transition: all 0.3s ease;
    opacity: 0.6;
  }

  .card:hover {
    transform: scale(1.05);
    box-shadow: 
      0 0 40px ${props => props.$color}44,
      inset 0 0 30px ${props => props.$color}22,
      0 0 60px ${props => props.$color}33;
  }

  .card:hover .icon-container {
    transform: scale(1.2);
    box-shadow: 0 0 20px ${props => props.$color};
  }

  .card:hover .category-badge {
    opacity: 0.3;
    transform: translateY(5px);
  }
`;

export default ParticleCard;