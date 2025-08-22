'use client';

import React from 'react';
import styled from 'styled-components';

const HolographicBackground = () => {
  return (
    <StyledWrapper>
      <div className="holographic-backdrop">
        <div className="nebula" />
        <div className="grid-plane" />
        <div className="hex-grid" />
        <div className="stars-container">
          <div className="star-layer" />
          <div className="star-layer" />
          <div className="star-layer" />
        </div>
        <div className="floating-particles">
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
        </div>
        <div className="energy-beams">
          <div className="beam" />
          <div className="beam" />
          <div className="beam" />
        </div>
        <div className="corner-ui">
          <div className="corner-frame" />
          <div className="corner-frame" />
          <div className="corner-frame" />
          <div className="corner-frame" />
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .holographic-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: -1;
    pointer-events: none;
    background: linear-gradient(135deg, #000000 0%, #001122 25%, #000811 50%, #001100 75%, #000000 100%);
  }

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
    background-image: 
      radial-gradient(2px 2px at 20% 30%, white, transparent),
      radial-gradient(2px 2px at 60% 70%, white, transparent),
      radial-gradient(1px 1px at 50% 50%, white, transparent),
      radial-gradient(1px 1px at 80% 10%, white, transparent),
      radial-gradient(2px 2px at 90% 60%, white, transparent),
      radial-gradient(1px 1px at 30% 80%, white, transparent),
      radial-gradient(1px 1px at 70% 40%, white, transparent);
    background-size: 500px 500px;
    background-repeat: repeat;
  }

  .star-layer:nth-child(1) {
    transform: translateZ(-50px);
    animation: star-drift 150s linear infinite;
  }

  .star-layer:nth-child(2) {
    transform: translateZ(-100px);
    animation: star-drift 200s linear infinite reverse;
    opacity: 0.6;
  }

  .star-layer:nth-child(3) {
    transform: translateZ(-200px);
    animation: star-drift 250s linear infinite;
    opacity: 0.4;
  }

  @keyframes star-drift {
    0% {
      transform: translateZ(-50px) translateY(0);
    }
    100% {
      transform: translateZ(-50px) translateY(100%);
    }
  }

  .nebula {
    position: absolute;
    width: 120%;
    height: 120%;
    top: -10%;
    left: -10%;
    background: radial-gradient(
        ellipse at 30% 30%,
        rgba(63, 0, 113, 0.3) 0%,
        rgba(63, 0, 113, 0) 70%
      ),
      radial-gradient(
        ellipse at 70% 60%,
        rgba(0, 113, 167, 0.3) 0%,
        rgba(0, 113, 167, 0) 70%
      ),
      radial-gradient(
        ellipse at 50% 50%,
        rgba(167, 0, 157, 0.2) 0%,
        rgba(167, 0, 157, 0) 70%
      );
    filter: blur(30px);
    opacity: 0.5;
    animation: nebula-shift 30s infinite alternate ease-in-out;
  }

  @keyframes nebula-shift {
    0% {
      transform: scale(1) rotate(0deg);
      opacity: 0.3;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      transform: scale(1.2) rotate(5deg);
      opacity: 0.4;
    }
  }

  .grid-plane {
    position: absolute;
    width: 200%;
    height: 200%;
    top: -50%;
    left: -50%;
    background-image: linear-gradient(
        rgba(0, 162, 255, 0.15) 1px,
        transparent 1px
      ),
      linear-gradient(90deg, rgba(0, 162, 255, 0.15) 1px, transparent 1px);
    background-size: 40px 40px;
    transform: perspective(500px) rotateX(60deg);
    transform-origin: center;
    animation: grid-move 20s linear infinite;
    opacity: 0.3;
  }

  @keyframes grid-move {
    0% {
      transform: perspective(500px) rotateX(60deg) translateY(0);
    }
    100% {
      transform: perspective(500px) rotateX(60deg) translateY(40px);
    }
  }

  /* Hex Grid Overlay */
  .hex-grid {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-image: 
      repeating-linear-gradient(0deg, transparent, transparent 35px, rgba(0, 221, 255, 0.05) 35px, rgba(0, 221, 255, 0.05) 36px),
      repeating-linear-gradient(60deg, transparent, transparent 35px, rgba(255, 0, 222, 0.05) 35px, rgba(255, 0, 222, 0.05) 36px),
      repeating-linear-gradient(-60deg, transparent, transparent 35px, rgba(0, 255, 119, 0.05) 35px, rgba(0, 255, 119, 0.05) 36px);
    opacity: 0.4;
    animation: hex-drift 25s linear infinite;
    pointer-events: none;
  }

  @keyframes hex-drift {
    0% { transform: translateX(0) translateY(0); }
    100% { transform: translateX(35px) translateY(60px); }
  }

  /* Floating Particles */
  .floating-particles {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .particle {
    position: absolute;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(0, 221, 255, 0.4) 50%, transparent 70%);
    border-radius: 50%;
    filter: blur(1px);
    opacity: 0;
    animation: particle-float 8s infinite ease-in-out;
  }

  .particle:nth-child(1) {
    width: 4px;
    height: 4px;
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }

  .particle:nth-child(2) {
    width: 6px;
    height: 6px;
    top: 60%;
    left: 80%;
    animation-delay: 2s;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 0, 222, 0.4) 50%, transparent 70%);
  }

  .particle:nth-child(3) {
    width: 3px;
    height: 3px;
    top: 80%;
    left: 30%;
    animation-delay: 4s;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(0, 255, 119, 0.4) 50%, transparent 70%);
  }

  .particle:nth-child(4) {
    width: 5px;
    height: 5px;
    top: 30%;
    left: 70%;
    animation-delay: 6s;
  }

  .particle:nth-child(5) {
    width: 4px;
    height: 4px;
    top: 50%;
    left: 20%;
    animation-delay: 1s;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 0, 222, 0.4) 50%, transparent 70%);
  }

  .particle:nth-child(6) {
    width: 7px;
    height: 7px;
    top: 70%;
    left: 60%;
    animation-delay: 3s;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(0, 255, 119, 0.4) 50%, transparent 70%);
  }

  .particle:nth-child(7) {
    width: 3px;
    height: 3px;
    top: 10%;
    left: 50%;
    animation-delay: 5s;
  }

  .particle:nth-child(8) {
    width: 6px;
    height: 6px;
    top: 90%;
    left: 85%;
    animation-delay: 7s;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 0, 222, 0.4) 50%, transparent 70%);
  }

  @keyframes particle-float {
    0%, 100% {
      transform: translateY(0) scale(0.8);
      opacity: 0;
    }
    25% {
      opacity: 0.6;
      transform: translateY(-20px) scale(1);
    }
    50% {
      opacity: 1;
      transform: translateY(-40px) scale(1.2);
    }
    75% {
      opacity: 0.6;
      transform: translateY(-20px) scale(1);
    }
  }

  /* Energy Beams */
  .energy-beams {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    opacity: 0.3;
  }

  .beam {
    position: absolute;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(0, 221, 255, 0.6) 20%, 
      rgba(255, 255, 255, 0.8) 50%, 
      rgba(255, 0, 222, 0.6) 80%, 
      transparent 100%);
    height: 1px;
    width: 100%;
    filter: blur(1px);
    animation: beam-sweep 6s ease-in-out infinite;
  }

  .beam:nth-child(1) {
    top: 25%;
    animation-delay: 0s;
  }

  .beam:nth-child(2) {
    top: 50%;
    animation-delay: 2s;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 0, 222, 0.6) 20%, 
      rgba(255, 255, 255, 0.8) 50%, 
      rgba(0, 221, 255, 0.6) 80%, 
      transparent 100%);
  }

  .beam:nth-child(3) {
    top: 75%;
    animation-delay: 4s;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(0, 255, 119, 0.6) 20%, 
      rgba(255, 255, 255, 0.8) 50%, 
      rgba(255, 85, 0, 0.6) 80%, 
      transparent 100%);
  }

  @keyframes beam-sweep {
    0%, 100% {
      opacity: 0;
      transform: scaleX(0);
    }
    50% {
      opacity: 0.8;
      transform: scaleX(1);
    }
  }

  /* Corner UI Frames */
  .corner-ui {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .corner-frame {
    position: absolute;
    width: 100px;
    height: 100px;
    border: 2px solid rgba(0, 221, 255, 0.3);
    animation: corner-pulse 4s ease-in-out infinite;
  }

  .corner-frame:nth-child(1) {
    top: 20px;
    left: 20px;
    border-right: none;
    border-bottom: none;
    animation-delay: 0s;
  }

  .corner-frame:nth-child(2) {
    top: 20px;
    right: 20px;
    border-left: none;
    border-bottom: none;
    border-color: rgba(255, 0, 222, 0.3);
    animation-delay: 1s;
  }

  .corner-frame:nth-child(3) {
    bottom: 20px;
    left: 20px;
    border-right: none;
    border-top: none;
    border-color: rgba(0, 255, 119, 0.3);
    animation-delay: 2s;
  }

  .corner-frame:nth-child(4) {
    bottom: 20px;
    right: 20px;
    border-left: none;
    border-top: none;
    border-color: rgba(255, 85, 0, 0.3);
    animation-delay: 3s;
  }

  @keyframes corner-pulse {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.05);
    }
  }
`;

export default HolographicBackground;