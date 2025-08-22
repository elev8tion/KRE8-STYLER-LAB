'use client';

import React from 'react';
import styled from 'styled-components';

interface HoloButtonProps {
  text?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

const HoloButton: React.FC<HoloButtonProps> = ({ 
  text = 'LAUNCH',
  onClick,
  variant = 'primary',
  size = 'medium'
}) => {
  return (
    <StyledWrapper $variant={variant} $size={size}>
      <div className="button-container">
        <div className="nebula" />
        <div className="stars-container">
          <div className="star-layer" />
          <div className="star-layer" />
          <div className="star-layer" />
        </div>
        
        <div className="button-hexagons">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="hexagon" />
          ))}
        </div>
        
        <div className="digital-glyphs">
          <div className="digital-glyph">0x88F8 EXEC PROTOCOL</div>
          <div className="digital-glyph">SYS.QUANTUM.INIT()</div>
          <div className="digital-glyph">01011000 01000001</div>
          <div className="digital-glyph">HOLO-CONN READY</div>
        </div>
        
        <button className="holo-button" onClick={onClick} data-magnetic="true">
          <div className="button-text">{text}</div>
          <div className="holo-glow" />
          <div className="button-glitch" />
          
          <div className="corner-accents">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="corner-accent" />
            ))}
          </div>
          
          <div className="holo-lines">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="holo-line" />
            ))}
          </div>
          
          <div className="scan-line" />
          
          <div className="holo-particles">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="holo-particle" />
            ))}
          </div>
        </button>
        
        <div className="sound-wave">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="wave-bar" />
          ))}
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div<{ $variant: string; $size: string }>`
  display: inline-block;
  position: relative;

  .button-container {
    position: relative;
    perspective: 1000px;
    transform-style: preserve-3d;
    z-index: 10;
  }

  /* Nebula background */
  .nebula {
    position: absolute;
    width: 120%;
    height: 120%;
    top: -10%;
    left: -10%;
    background: ${props => props.$variant === 'danger' 
      ? `radial-gradient(ellipse at 30% 30%, rgba(255, 0, 100, 0.3) 0%, transparent 70%)`
      : `radial-gradient(ellipse at 30% 30%, rgba(63, 0, 113, 0.3) 0%, transparent 70%),
         radial-gradient(ellipse at 70% 60%, rgba(0, 113, 167, 0.3) 0%, transparent 70%)`
    };
    filter: blur(30px);
    opacity: 0.5;
    animation: nebula-shift 32s infinite alternate ease-in-out;
  }

  @keyframes nebula-shift {
    0% { transform: scale(1) rotate(0deg); opacity: 0.3; }
    50% { opacity: 0.5; }
    100% { transform: scale(1.2) rotate(5deg); opacity: 0.4; }
  }

  /* Stars */
  .stars-container {
    position: absolute;
    width: 100%;
    height: 100%;
    perspective: 500px;
    transform-style: preserve-3d;
  }

  .star-layer {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0.8;
  }

  .star-layer:nth-child(1) {
    transform: translateZ(-50px);
    animation: star-drift 160s linear infinite;
  }

  .star-layer:nth-child(2) {
    transform: translateZ(-100px);
    animation: star-drift 200s linear infinite reverse;
    opacity: 0.6;
  }

  .star-layer:nth-child(3) {
    transform: translateZ(-200px);
    animation: star-drift 256s linear infinite;
    opacity: 0.4;
  }

  .star-layer::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(1px 1px at 10% 10%, white 100%, transparent),
      radial-gradient(1px 1px at 20% 80%, white 100%, transparent),
      radial-gradient(2px 2px at 88% 30%, white 100%, transparent),
      radial-gradient(1px 1px at 40% 40%, white 100%, transparent),
      radial-gradient(2px 2px at 56% 64%, white 100%, transparent);
  }

  @keyframes star-drift {
    0% { transform: translateZ(-50px) translateY(0); }
    100% { transform: translateZ(-50px) translateY(100%); }
  }

  /* Main button */
  .holo-button {
    position: relative;
    width: ${props => props.$size === 'small' ? '200px' : props.$size === 'large' ? '320px' : '280px'};
    height: ${props => props.$size === 'small' ? '56px' : props.$size === 'large' ? '96px' : '80px'};
    background: rgba(10, 10, 30, 0.6);
    border: none;
    border-radius: 24px; /* Rounded corners as requested */
    color: ${props => props.$variant === 'danger' ? '#ff5588' : '#00ddff'};
    font-family: "Orbitron", sans-serif;
    font-size: ${props => props.$size === 'small' ? '14px' : props.$size === 'large' ? '24px' : '18px'};
    font-weight: 700;
    letter-spacing: 3px;
    text-shadow: 0 0 10px ${props => props.$variant === 'danger' ? 'rgba(255, 85, 136, 0.5)' : 'rgba(0, 221, 255, 0.5)'};
    cursor: pointer;
    overflow: hidden;
    transform-style: preserve-3d;
    transition: all 0.3s ease;
    outline: none;
    z-index: 5;
  }

  .holo-button::before {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    background: linear-gradient(45deg, 
      rgba(0, 0, 40, 0.8) 0%, 
      rgba(0, 20, 50, 0.8) 50%, 
      rgba(5, 10, 30, 0.8) 100%
    );
    z-index: -1;
    border-radius: 22px;
  }

  /* Holographic glow */
  .holo-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    background: radial-gradient(ellipse at center, 
      ${props => props.$variant === 'danger' 
        ? 'rgba(255, 85, 136, 0.2)' 
        : 'rgba(0, 221, 255, 0.2)'} 0%, 
      transparent 70%
    );
    pointer-events: none;
    z-index: 1;
    opacity: 0.7;
    filter: blur(10px);
    animation: glow-pulse 4s infinite alternate;
  }

  @keyframes glow-pulse {
    0% { opacity: 0.4; filter: blur(10px) brightness(0.8); }
    100% { opacity: 0.8; filter: blur(16px) brightness(1.2); }
  }

  /* Holographic lines */
  .holo-lines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
    z-index: 2;
  }

  .holo-line {
    position: absolute;
    background: ${props => props.$variant === 'danger' 
      ? 'rgba(255, 85, 136, 0.5)' 
      : 'rgba(0, 221, 255, 0.5)'};
    filter: blur(1px);
  }

  .holo-line:nth-child(1) {
    top: 0;
    left: 30px;
    width: 1.5px;
    height: 100%;
    animation: line-pulse 2s infinite alternate;
    animation-delay: -0.5s;
  }

  .holo-line:nth-child(2) {
    top: 0;
    right: 30px;
    width: 1.5px;
    height: 100%;
    animation: line-pulse 2s infinite alternate;
    animation-delay: -1s;
  }

  .holo-line:nth-child(3) {
    top: 16px;
    left: 0;
    width: 100%;
    height: 1.5px;
    animation: line-pulse 2s infinite alternate;
    animation-delay: -1.5s;
  }

  .holo-line:nth-child(4) {
    bottom: 16px;
    left: 0;
    width: 100%;
    height: 1.5px;
    animation: line-pulse 2s infinite alternate;
    animation-delay: -2s;
  }

  @keyframes line-pulse {
    0% { 
      opacity: 0.3; 
      background: ${props => props.$variant === 'danger' 
        ? 'rgba(255, 85, 136, 0.5)' 
        : 'rgba(0, 221, 255, 0.5)'};
    }
    100% { 
      opacity: 0.8; 
      background: ${props => props.$variant === 'danger' 
        ? 'rgba(255, 0, 100, 0.5)' 
        : 'rgba(255, 0, 222, 0.5)'};
    }
  }

  /* Scan line - slower as requested */
  .scan-line {
    position: absolute;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      ${props => props.$variant === 'danger' 
        ? 'rgba(255, 85, 136, 0.5)' 
        : 'rgba(0, 221, 255, 0.5)'} 20%, 
      rgba(255, 255, 255, 0.8) 50%, 
      ${props => props.$variant === 'danger' 
        ? 'rgba(255, 0, 100, 0.5)' 
        : 'rgba(255, 0, 222, 0.5)'} 80%, 
      transparent 100%
    );
    top: 0;
    left: 0;
    filter: blur(1px);
    opacity: 0;
    z-index: 2;
    pointer-events: none;
    animation: scan 8s infinite; /* Slower scan as requested */
  }

  @keyframes scan {
    0% { top: -5px; opacity: 0; }
    15% { opacity: 0.8; }
    85% { opacity: 0.8; }
    100% { top: calc(100% + 5px); opacity: 0; }
  }

  /* Particles - slower drift */
  .holo-particles {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 1;
  }

  .holo-particle {
    position: absolute;
    background: white;
    box-shadow: 0 0 10px ${props => props.$variant === 'danger' 
      ? 'rgba(255, 85, 136, 0.7)' 
      : 'rgba(0, 221, 255, 0.7)'};
    border-radius: 50%;
    filter: blur(1px);
    opacity: 0;
    pointer-events: none;
    animation: particle-float 8s infinite ease-out; /* Slower particle animation */
  }

  .holo-particle:nth-child(1) { width: 3px; height: 3px; top: 70%; left: 16%; animation-delay: 0.2s; }
  .holo-particle:nth-child(2) { width: 2px; height: 2px; top: 64%; left: 32%; animation-delay: 0.8s; }
  .holo-particle:nth-child(3) { width: 4px; height: 4px; top: 80%; left: 48%; animation-delay: 1.6s; }
  .holo-particle:nth-child(4) { width: 2px; height: 2px; top: 72%; left: 64%; animation-delay: 2.4s; }
  .holo-particle:nth-child(5) { width: 3px; height: 3px; top: 88%; left: 24%; animation-delay: 3.2s; }
  .holo-particle:nth-child(6) { width: 2px; height: 2px; top: 56%; left: 72%; animation-delay: 4s; }
  .holo-particle:nth-child(7) { width: 3px; height: 3px; top: 80%; left: 40%; animation-delay: 4.8s; }
  .holo-particle:nth-child(8) { width: 2px; height: 2px; top: 64%; left: 88%; animation-delay: 5.6s; }

  @keyframes particle-float {
    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
    10% { opacity: 0.8; }
    100% { transform: translateY(-48px) rotate(360deg); opacity: 0; }
  }

  /* Hexagons */
  .button-hexagons {
    position: absolute;
    width: 380px;
    height: 180px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 1;
  }

  .hexagon {
    position: absolute;
    width: 32px;
    height: 18.48px;
    background: transparent;
    border: 1.5px solid ${props => props.$variant === 'danger' 
      ? 'rgba(255, 85, 136, 0.3)' 
      : 'rgba(0, 221, 255, 0.3)'};
    transform: rotate(30deg);
    opacity: 0;
    animation: hexagon-pulse 4s infinite;
  }

  .hexagon::before,
  .hexagon::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: transparent;
    border: 1.5px solid ${props => props.$variant === 'danger' 
      ? 'rgba(255, 85, 136, 0.3)' 
      : 'rgba(0, 221, 255, 0.3)'};
  }

  .hexagon::before { transform: rotate(60deg); }
  .hexagon::after { transform: rotate(-60deg); }

  .hexagon:nth-child(1) { top: 24px; left: 24px; animation-delay: 0.1s; }
  .hexagon:nth-child(2) { top: 24px; right: 24px; animation-delay: 0.4s; }
  .hexagon:nth-child(3) { bottom: 24px; left: 24px; animation-delay: 0.8s; }
  .hexagon:nth-child(4) { bottom: 24px; right: 24px; animation-delay: 1.2s; }
  .hexagon:nth-child(5) { top: 50%; left: 0; transform: translate(0, -50%) rotate(30deg); animation-delay: 1.6s; }
  .hexagon:nth-child(6) { top: 50%; right: 0; transform: translate(0, -50%) rotate(30deg); animation-delay: 2s; }

  @keyframes hexagon-pulse {
    0% { opacity: 0; transform: rotate(30deg) scale(0.8); }
    20% { opacity: 0.5; transform: rotate(30deg) scale(1); }
    80% { opacity: 0.5; transform: rotate(30deg) scale(1); }
    100% { opacity: 0; transform: rotate(30deg) scale(1.2); }
  }

  /* Digital glyphs */
  .digital-glyphs {
    position: absolute;
    width: 400px;
    height: 200px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 1;
  }

  .digital-glyph {
    position: absolute;
    color: ${props => props.$variant === 'danger' 
      ? 'rgba(255, 85, 136, 0.5)' 
      : 'rgba(0, 221, 255, 0.5)'};
    font-size: 8px;
    font-family: "Fira Code", monospace;
    white-space: nowrap;
    opacity: 0;
    animation: glyph-fade 8s infinite;
  }

  .digital-glyph:nth-child(1) { top: -32px; left: 64px; animation-delay: 0.2s; }
  .digital-glyph:nth-child(2) { top: -24px; right: 48px; animation-delay: 0.8s; }
  .digital-glyph:nth-child(3) { bottom: -32px; left: 88px; animation-delay: 1.6s; }
  .digital-glyph:nth-child(4) { bottom: -24px; right: 64px; animation-delay: 2.4s; }

  @keyframes glyph-fade {
    0% { opacity: 0; transform: translateY(0); }
    10% { opacity: 0.8; }
    90% { opacity: 0.8; }
    100% { opacity: 0; transform: translateY(-8px); }
  }

  /* Corner accents */
  .corner-accents {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .corner-accent {
    position: absolute;
    width: 16px;
    height: 16px;
    border-style: solid;
    border-width: 2px;
    border-color: ${props => props.$variant === 'danger' 
      ? 'rgba(255, 85, 136, 0.7)' 
      : 'rgba(0, 221, 255, 0.7)'};
  }

  .corner-accent:nth-child(1) {
    top: 8px;
    left: 8px;
    border-right: none;
    border-bottom: none;
    border-top-left-radius: 8px;
  }

  .corner-accent:nth-child(2) {
    top: 8px;
    right: 8px;
    border-left: none;
    border-bottom: none;
    border-top-right-radius: 8px;
  }

  .corner-accent:nth-child(3) {
    bottom: 8px;
    left: 8px;
    border-right: none;
    border-top: none;
    border-bottom-left-radius: 8px;
  }

  .corner-accent:nth-child(4) {
    bottom: 8px;
    right: 8px;
    border-left: none;
    border-top: none;
    border-bottom-right-radius: 8px;
  }

  /* Glitch effect */
  .button-glitch {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    pointer-events: none;
    z-index: 3;
    opacity: 0;
    animation: button-glitch 8s infinite;
    border-radius: 24px;
  }

  @keyframes button-glitch {
    0%, 100% { opacity: 0; }
    94%, 96% { opacity: 0; }
    94.5% {
      opacity: 0.8;
      transform: translate(5px, -2px) skew(-5deg, 2deg);
      background: rgba(255, 0, 222, 0.2);
    }
    95% {
      opacity: 0.8;
      transform: translate(-5px, 2px) skew(5deg, -2deg);
      background: rgba(0, 221, 255, 0.2);
    }
    95.5% {
      opacity: 0.8;
      transform: translate(2px, 0) skew(-2deg, 0);
      background: rgba(255, 255, 255, 0.2);
    }
  }

  /* Sound wave */
  .sound-wave {
    position: absolute;
    bottom: -32px;
    left: 0;
    width: 100%;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
  }

  .wave-bar {
    width: 2px;
    height: 8px;
    background: ${props => props.$variant === 'danger' 
      ? 'rgba(255, 85, 136, 0.5)' 
      : 'rgba(0, 221, 255, 0.5)'};
    margin: 0 2px;
    border-radius: 1px;
    animation: wave-animation 1.5s infinite;
  }

  @keyframes wave-animation {
    0%, 100% { height: 8px; }
    50% { height: 16px; }
  }

  .wave-bar:nth-child(1) { animation-delay: 0.1s; }
  .wave-bar:nth-child(2) { animation-delay: 0.2s; }
  .wave-bar:nth-child(3) { animation-delay: 0.3s; }
  .wave-bar:nth-child(4) { animation-delay: 0.4s; }
  .wave-bar:nth-child(5) { animation-delay: 0.5s; }
  .wave-bar:nth-child(6) { animation-delay: 0.6s; }
  .wave-bar:nth-child(7) { animation-delay: 0.7s; }
  .wave-bar:nth-child(8) { animation-delay: 0.8s; }
  .wave-bar:nth-child(9) { animation-delay: 0.9s; }
  .wave-bar:nth-child(10) { animation-delay: 1s; }
  .wave-bar:nth-child(11) { animation-delay: 0.9s; }
  .wave-bar:nth-child(12) { animation-delay: 0.8s; }
  .wave-bar:nth-child(13) { animation-delay: 0.7s; }
  .wave-bar:nth-child(14) { animation-delay: 0.6s; }
  .wave-bar:nth-child(15) { animation-delay: 0.5s; }
  .wave-bar:nth-child(16) { animation-delay: 0.4s; }

  /* Hover states */
  .holo-button:hover {
    color: rgb(255, 255, 255);
    text-shadow: 0 0 16px rgba(255, 255, 255, 0.8);
    transform: scale(1.02);
    transition: all 0.2s ease;
  }

  .holo-button:hover .holo-glow {
    background: radial-gradient(ellipse at center, 
      rgba(255, 255, 255, 0.3) 0%, 
      ${props => props.$variant === 'danger' 
        ? 'rgba(255, 85, 136, 0.2)' 
        : 'rgba(0, 221, 255, 0.2)'} 40%, 
      transparent 70%
    );
    animation: glow-pulse-hover 1.5s infinite alternate;
  }

  @keyframes glow-pulse-hover {
    0% { opacity: 0.6; filter: blur(10px) brightness(1); }
    100% { opacity: 0.9; filter: blur(16px) brightness(1.5); }
  }

  /* Active state */
  .holo-button:active {
    transform: scale(0.98);
    transition: all 0.1s ease;
  }

  .holo-button:active .holo-glow {
    opacity: 1;
    background: radial-gradient(ellipse at center, 
      rgba(255, 255, 255, 0.5) 0%, 
      ${props => props.$variant === 'danger' 
        ? 'rgba(255, 0, 100, 0.3)' 
        : 'rgba(255, 0, 222, 0.3)'} 40%, 
      transparent 70%
    );
  }

  .button-text {
    position: relative;
    z-index: 5;
    transform-style: preserve-3d;
  }
`;

export default HoloButton;