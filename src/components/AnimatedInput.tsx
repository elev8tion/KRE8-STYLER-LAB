'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface AnimatedInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  className?: string;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  value,
  onChange,
  onKeyDown,
  placeholder = 'Type something...',
  type = 'text',
  disabled = false,
  className
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <StyledWrapper className={className}>
      <motion.div 
        className="input-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`input-wrapper ${isFocused ? 'focused' : ''}`}>
          <input
            type={type}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            className="animated-input"
          />
          <div className="input-border" />
          <div className="input-glow" />
          <div className="scan-line" />
        </div>
      </motion.div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .input-container {
    position: relative;
    width: 100%;
  }
  
  .input-wrapper {
    position: relative;
    width: 100%;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    &.focused {
      background: rgba(0, 0, 0, 0.7);
      transform: translateY(-2px);
      
      .input-border {
        opacity: 1;
        animation: border-pulse 2s infinite;
      }
      
      .input-glow {
        opacity: 0.5;
      }
      
      .scan-line {
        animation: scan 2s infinite;
      }
    }
  }
  
  .animated-input {
    width: 100%;
    padding: 16px 20px;
    background: transparent;
    border: none;
    outline: none;
    color: #ffffff;
    font-size: 16px;
    font-family: 'Inter', sans-serif;
    position: relative;
    z-index: 2;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.3);
      transition: color 0.3s;
    }
    
    &:focus::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  .input-border {
    position: absolute;
    inset: 0;
    border-radius: 12px;
    padding: 1px;
    background: linear-gradient(135deg, #00ddff, #ff00dd, #00ff88);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.3;
    transition: opacity 0.3s;
    pointer-events: none;
  }
  
  @keyframes border-pulse {
    0%, 100% {
      opacity: 0.5;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.002);
    }
  }
  
  .input-glow {
    position: absolute;
    inset: -50%;
    background: radial-gradient(circle at center, rgba(0, 221, 255, 0.1) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
  }
  
  .scan-line {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(0, 221, 255, 0.1) 45%, 
      rgba(0, 221, 255, 0.3) 50%, 
      rgba(0, 221, 255, 0.1) 55%, 
      transparent 100%);
    pointer-events: none;
    opacity: 0;
  }
  
  @keyframes scan {
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
`;

export default AnimatedInput;