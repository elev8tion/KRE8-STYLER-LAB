'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'holographic';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'holographic',
  size = 'medium',
  className
}) => {
  return (
    <StyledWrapper className={className}>
      <motion.button
        className={`animated-btn ${variant} ${size}`}
        onClick={onClick}
        disabled={disabled}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <span className="btn-content">{children}</span>
        <div className="btn-glow" />
        <div className="btn-particles">
          <span className="particle" />
          <span className="particle" />
          <span className="particle" />
        </div>
      </motion.button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .animated-btn {
    position: relative;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    
    &.small {
      padding: 8px 16px;
      font-size: 14px;
    }
    
    &.large {
      padding: 16px 32px;
      font-size: 18px;
    }
    
    &.holographic {
      background: linear-gradient(135deg, rgba(0, 221, 255, 0.1) 0%, rgba(255, 0, 221, 0.1) 100%);
      border: 1px solid transparent;
      background-origin: border-box;
      background-clip: padding-box, border-box;
      color: #00ddff;
      position: relative;
      
      &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 12px;
        padding: 1px;
        background: linear-gradient(135deg, #00ddff, #ff00dd, #00ff88);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        opacity: 0.7;
        transition: opacity 0.3s;
      }
      
      &:hover::before {
        opacity: 1;
      }
      
      &:hover {
        background: linear-gradient(135deg, rgba(0, 221, 255, 0.2) 0%, rgba(255, 0, 221, 0.2) 100%);
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(0, 221, 255, 0.3);
      }
    }
    
    &.primary {
      background: linear-gradient(135deg, #00ddff 0%, #0099cc 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(0, 221, 255, 0.3);
      
      &:hover {
        background: linear-gradient(135deg, #00eeff 0%, #00aadd 100%);
        box-shadow: 0 6px 20px rgba(0, 221, 255, 0.4);
      }
    }
    
    &.secondary {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.3);
      }
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      
      &:hover {
        transform: none;
        box-shadow: none;
      }
    }
  }
  
  .btn-content {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  
  .btn-glow {
    position: absolute;
    inset: -50%;
    background: radial-gradient(circle at center, rgba(0, 221, 255, 0.3) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
  }
  
  .animated-btn:hover .btn-glow {
    opacity: 1;
    animation: pulse-glow 2s infinite;
  }
  
  @keyframes pulse-glow {
    0%, 100% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.2);
      opacity: 1;
    }
  }
  
  .btn-particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(0, 221, 255, 0.4) 100%);
    border-radius: 50%;
    opacity: 0;
  }
  
  .animated-btn:hover .particle {
    animation: float-particle 1.5s infinite;
  }
  
  .particle:nth-child(1) {
    left: 10%;
    animation-delay: 0s;
  }
  
  .particle:nth-child(2) {
    left: 50%;
    animation-delay: 0.5s;
  }
  
  .particle:nth-child(3) {
    left: 90%;
    animation-delay: 1s;
  }
  
  @keyframes float-particle {
    0% {
      transform: translateY(0) scale(0);
      opacity: 0;
    }
    20% {
      transform: translateY(-20px) scale(1);
      opacity: 1;
    }
    100% {
      transform: translateY(-80px) scale(0);
      opacity: 0;
    }
  }
`;

export default AnimatedButton;