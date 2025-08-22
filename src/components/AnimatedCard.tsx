'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  status?: 'active' | 'ready' | 'inactive';
  className?: string;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  title,
  icon,
  status = 'active',
  className
}) => {
  return (
    <StyledWrapper className={className}>
      <motion.div
        className={`animated-card ${status}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      >
        {title && (
          <div className="card-header">
            <span className="card-title">{title}</span>
            {icon && <div className="card-icon">{icon}</div>}
          </div>
        )}
        <div className="card-content">
          {children}
        </div>
        <div className="card-glow" />
        <div className="card-scan" />
        <div className="corner-accent top-left" />
        <div className="corner-accent top-right" />
        <div className="corner-accent bottom-left" />
        <div className="corner-accent bottom-right" />
      </motion.div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .animated-card {
    position: relative;
    background: rgba(15, 15, 25, 0.6);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(0, 221, 255, 0.2);
    border-radius: 16px;
    padding: 20px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 16px;
      padding: 1px;
      background: linear-gradient(135deg, 
        rgba(0, 221, 255, 0.3),
        rgba(255, 0, 221, 0.3),
        rgba(0, 255, 136, 0.3));
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: 0.5;
      transition: opacity 0.3s;
    }
    
    &:hover::before {
      opacity: 1;
      animation: border-flow 3s linear infinite;
    }
    
    &.active {
      border-color: rgba(0, 255, 136, 0.3);
      
      .card-icon {
        color: #00ff88;
      }
    }
    
    &.ready {
      border-color: rgba(0, 221, 255, 0.3);
      
      .card-icon {
        color: #00ddff;
      }
    }
    
    &.inactive {
      border-color: rgba(255, 255, 255, 0.1);
      opacity: 0.7;
      
      .card-icon {
        color: rgba(255, 255, 255, 0.5);
      }
    }
    
    &:hover {
      background: rgba(15, 15, 25, 0.8);
      border-color: rgba(0, 221, 255, 0.4);
      box-shadow: 0 8px 32px rgba(0, 221, 255, 0.2);
      
      .card-glow {
        opacity: 1;
      }
      
      .corner-accent {
        opacity: 1;
        width: 20px;
        height: 20px;
      }
    }
  }
  
  @keyframes border-flow {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 200% 50%;
    }
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .card-title {
    font-size: 14px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.8);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .card-icon {
    font-size: 20px;
    transition: all 0.3s;
    filter: drop-shadow(0 0 8px currentColor);
  }
  
  .card-content {
    position: relative;
    z-index: 2;
    color: rgba(255, 255, 255, 0.9);
  }
  
  .card-glow {
    position: absolute;
    inset: -50%;
    background: radial-gradient(circle at center, 
      rgba(0, 221, 255, 0.1) 0%, 
      transparent 60%);
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
  }
  
  .card-scan {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(0, 221, 255, 0.8) 50%, 
      transparent 100%);
    opacity: 0;
  }
  
  .animated-card:hover .card-scan {
    animation: scan-line 2s infinite;
  }
  
  @keyframes scan-line {
    0% {
      left: -100%;
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      left: 100%;
      opacity: 0;
    }
  }
  
  .corner-accent {
    position: absolute;
    width: 12px;
    height: 12px;
    border: 2px solid rgba(0, 221, 255, 0.5);
    opacity: 0.5;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .corner-accent.top-left {
    top: -1px;
    left: -1px;
    border-right: none;
    border-bottom: none;
    border-top-left-radius: 16px;
  }
  
  .corner-accent.top-right {
    top: -1px;
    right: -1px;
    border-left: none;
    border-bottom: none;
    border-top-right-radius: 16px;
  }
  
  .corner-accent.bottom-left {
    bottom: -1px;
    left: -1px;
    border-right: none;
    border-top: none;
    border-bottom-left-radius: 16px;
  }
  
  .corner-accent.bottom-right {
    bottom: -1px;
    right: -1px;
    border-left: none;
    border-top: none;
    border-bottom-right-radius: 16px;
  }
`;

export default AnimatedCard;