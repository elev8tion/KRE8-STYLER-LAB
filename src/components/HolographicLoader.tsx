import React from 'react';
import styled from 'styled-components';

const HolographicLoader = () => {
  // --- Tesla × Metatron correlation (kept tiny & fast) ---
  const TESLA = [3, 6, 9];
  const METATRON = [6, 13, 33, 111, 1111];
  const digitalRoot = (n: number) => ((n - 1) % 9) + 1;
  const jaccard = (A: number[], B: number[]) => {
    const a = new Set(A), b = new Set(B);
    const inter = [...a].filter(x => b.has(x)).length;
    const uni = new Set([...a, ...b]).size;
    return inter / uni;
  };
  const jdr = jaccard(TESLA.map(digitalRoot), METATRON.map(digitalRoot)); // digital-root Jaccard
  const tDiv3 = TESLA.filter(n => n % 3 === 0).length / TESLA.length;
  const mDiv3 = METATRON.filter(n => n % 3 === 0).length / METATRON.length;
  const resonance = (jdr + (tDiv3 + mDiv3) / 2) / 2; // composite resonance
  const resonanceLine =
    `TESLA(3,6,9) ↔ METATRON(6,13,33,111,1111) :: digitalRootJaccard=${jdr.toFixed(3)} mod3Overlap=${(((tDiv3 + mDiv3) / 2)).toFixed(3)} resonance=${resonance.toFixed(3)}`;

  const metaJSON = JSON.stringify({
    tesla: TESLA,
    metatron: METATRON,
    digital_roots: { tesla: TESLA.map(digitalRoot), metatron: METATRON.map(digitalRoot) },
    overlap_digital_roots: [...new Set(TESLA.map(digitalRoot))].filter(x => new Set(METATRON.map(digitalRoot)).has(x)),
    digitalRootJaccard: jdr,
    mod3Overlap: (tDiv3 + mDiv3) / 2,
    resonance,
    design_encodings: { nodes: 13, dash_cycles: [3, 6, 9], outer_ports: 6, triads: 3 }
  });
  return (
    <StyledWrapper data-resonance={resonance.toFixed(3)}>
      <div className="holographic-backdrop">
        <div className="nebula" />
        <div className="grid-plane" />
        <div className="stars-container">
          <div className="star-layer" />
          <div className="star-layer" />
          <div className="star-layer" />
        </div>
        <div className="loader-container">
          {/* TAG: PLATFORM - Base platform with glow effect */}
          <div className="hologram-platform" />
          
          {/* TAG: PLATFORM-RINGS - Concentric rings on platform */}
          <div className="platform-rings">
            <div className="platform-ring" />
            <div className="platform-ring" />
            <div className="platform-ring" />
          </div>
          
          {/* TAG: PROJECTION-BEAMS - Upward beams from platform */}
          <div className="projection-beams">
            <div className="beam" />
            <div className="beam" />
            <div className="beam" />
            <div className="beam" />
          </div>
          
          {/* TAG: MAIN-HOLO-CONTAINER - Container for central hologram */}
          <div className="holo-container">
            {/* === Cyberpunk Metatron with hidden numerology metadata === */}
            <div className="metatron-sphere">
              <svg viewBox="-200 -200 400 400" xmlns="http://www.w3.org/2000/svg" aria-label="Metatron Tesla Resonance Sigil">
                <metadata>{metaJSON}</metadata>
                <defs>
                  <linearGradient id="cyan-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00ffff" stopOpacity="1">
                      <animate attributeName="stop-color" values="#00ffff;#00e5ff;#00ffff" dur="3s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="50%" stopColor="#00e5ff" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#00ffff" stopOpacity="1">
                      <animate attributeName="stop-color" values="#00ffff;#00ccff;#00ffff" dur="3s" repeatCount="indefinite" />
                    </stop>
                  </linearGradient>

                  <linearGradient id="magenta-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff00ff" stopOpacity="1">
                      <animate attributeName="stop-color" values="#ff00ff;#ff00aa;#ff00ff" dur="3s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="50%" stopColor="#ff00aa" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#ff00ff" stopOpacity="1">
                      <animate attributeName="stop-color" values="#ff00ff;#ff00cc;#ff00ff" dur="3s" repeatCount="indefinite" />
                    </stop>
                  </linearGradient>

                  <filter id="glow"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                  <filter id="intense-glow"><feGaussianBlur stdDeviation="8" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>

                {/* Outer rings (3-6-9 dash cycles infused) */}
                <g className="outer-rings">
                  <circle cx="0" cy="0" r="180" stroke="url(#cyan-gradient)" strokeWidth="3" fill="none" opacity="0.8" filter="url(#glow)">
                    <animate attributeName="r" values="180;185;180" dur="4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;1;0.8" dur="4s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="0" cy="0" r="170" stroke="url(#cyan-gradient)" strokeWidth="1" fill="none" opacity="0.65">
                    <animate attributeName="stroke-dasharray" values="3,6,9;9,6,3;3,6,9" dur="12s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="0" cy="0" r="160" stroke="url(#magenta-gradient)" strokeWidth="2" fill="none" opacity="0.75" filter="url(#glow)">
                    <animate attributeName="r" values="160;155;160" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="stroke-dasharray" values="9,6,3;3,6,9;9,6,3" dur="9s" repeatCount="indefinite" />
                  </circle>
                </g>

                {/* Hexagon */}
                <polygon points="0,-100 87,-50 87,50 0,100 -87,50 -87,-50"
                  stroke="url(#cyan-gradient)" strokeWidth="3" fill="none" filter="url(#glow)">
                  <animate attributeName="stroke-width" values="3;4;3" dur="2s" repeatCount="indefinite" />
                  <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="60s" repeatCount="indefinite" />
                </polygon>

                {/* Star of David */}
                <g className="star-of-david">
                  <polygon points="0,-120 104,60 -104,60" stroke="url(#cyan-gradient)" strokeWidth="3" fill="none" filter="url(#intense-glow)">
                    <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
                  </polygon>
                  <polygon points="0,120 104,-60 -104,-60" stroke="url(#cyan-gradient)" strokeWidth="3" fill="none" filter="url(#intense-glow)">
                    <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" begin="1.5s" />
                  </polygon>
                </g>

                {/* Center core */}
                <g className="central-core">
                  <circle cx="0" cy="0" r="40" stroke="url(#magenta-gradient)" strokeWidth="4" fill="none" filter="url(#intense-glow)">
                    <animate attributeName="r" values="40;45;40" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="0" cy="0" r="35" stroke="url(#magenta-gradient)" strokeWidth="2" fill="none" opacity="0.6" />
                  <circle cx="0" cy="0" r="30" stroke="url(#magenta-gradient)" strokeWidth="1" fill="none" opacity="0.4" />
                  <circle cx="0" cy="0" r="20" fill="url(#magenta-gradient)" opacity="0.3">
                    <animate attributeName="opacity" values="0.3;0.6;0.3" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                </g>

                {/* 6 outer + 6 hex + 1 center = 13 nodes */}
                <g className="node-points">
                  {/* outer 6 */}
                  <circle cx="0" cy="-180" r="8" fill="url(#cyan-gradient)" filter="url(#intense-glow)">
                    <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="0" cy="180" r="8" fill="url(#cyan-gradient)" filter="url(#intense-glow)">
                    <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" begin="0.3s" />
                  </circle>
                  <circle cx="156" cy="-90" r="8" fill="url(#cyan-gradient)" filter="url(#intense-glow)">
                    <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" begin="0.6s" />
                  </circle>
                  <circle cx="-156" cy="-90" r="8" fill="url(#cyan-gradient)" filter="url(#intense-glow)">
                    <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" begin="0.9s" />
                  </circle>
                  <circle cx="156" cy="90" r="8" fill="url(#cyan-gradient)" filter="url(#intense-glow)">
                    <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" begin="1.2s" />
                  </circle>
                  <circle cx="-156" cy="90" r="8" fill="url(#cyan-gradient)" filter="url(#intense-glow)">
                    <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" begin="1.5s" />
                  </circle>

                  {/* center node */}
                  <circle cx="0" cy="0" r="6" fill="#fff">
                    <animate attributeName="r" values="6;9;6" dur="3s" repeatCount="indefinite" />
                  </circle>
                </g>

                {/* hexagon corner nodes (6) */}
                <g className="hex-nodes">
                  {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <circle
                      key={i}
                      cx={87 * Math.cos((angle - 90) * Math.PI / 180)}
                      cy={87 * Math.sin((angle - 90) * Math.PI / 180)}
                      r="6"
                      fill="url(#magenta-gradient)"
                      filter="url(#glow)"
                    >
                      <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" begin={`${i * 0.45}s`} />
                    </circle>
                  ))}
                </g>


                {/* light grid */}
                <g stroke="url(#cyan-gradient)" strokeWidth="0.5" fill="none" opacity="0.2">
                  <path d="M -200,-100 L 200,-100 M -200,0 L 200,0 M -200,100 L 200,100" />
                  <path d="M -100,-200 L -100,200 M 0,-200 L 0,200 M 100,-200 L 100,200" />
                </g>
              </svg>

              {/* particles */}
              <div className="holo-particles">
                {Array.from({ length: 12 }).map((_, i) => <div key={i} className="holo-particle" />)}
              </div>
            </div>

            <div className="glitch-effect" />
            <div className="lightning" />
          </div>
          
          {/* === CODE LINES (added resonance readout) === */}
          <div className="code-lines">
            <div className="code-line">{resonanceLine}</div>
            <div className="code-line">function initHolographicMatrix() {'{'} connectNodes(); renderQuantumState(); {'}'}</div>
            <div className="code-line">const matrix = [1.2, 0.8, 3.1, 2.7, 5.9, 4.3, 7.2, 9.0];</div>
            <div className="code-line">class QuantumProcessor {'{'} constructor() {'{'} this.entanglement = new Map(); {'}'}{'}'}</div>
            <div className="code-line">async function loadHolographicData() {'{'} await fetch('/api/quantum'); {'}'}</div>
          </div>
          
          {/* TAG: HOLO-NUMBERS - Floating hex numbers */}
          <div className="holo-numbers">
            <div className="number" style={{top: '40%', left: '30%', animationDelay: '0.5s'}}>
              0xFF
            </div>
            <div className="number" style={{top: '50%', left: '60%', animationDelay: '1.5s'}}>
              0x0A
            </div>
            <div className="number" style={{top: '60%', left: '40%', animationDelay: '2.5s'}}>
              0xB4
            </div>
            <div className="number" style={{top: '30%', left: '50%', animationDelay: '3.5s'}}>
              0x3D
            </div>
            <div className="number" style={{top: '70%', left: '20%', animationDelay: '4.5s'}}>
              0xC2
            </div>
            <div className="number" style={{top: '20%', left: '70%', animationDelay: '5.5s'}}>
              0x19
            </div>
          </div>
          
          {/* TAG: RADIAL-INDICATORS - Pulsing concentric circles */}
          <div className="radial-indicators">
            <div className="radial-indicator" />
            <div className="radial-indicator" />
            <div className="radial-indicator" />
            <div className="radial-indicator" />
          </div>
          
          {/* TAG: CORNER-DECORATIONS - Corner bracket frames */}
          <div className="corner-decorations">
            <div className="corner" />
            <div className="corner" />
            <div className="corner" />
            <div className="corner" />
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  
  .holographic-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: linear-gradient(135deg, #000000 0%, #001122 25%, #000811 50%, #001100 75%, #000000 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    
    /* Full viewport atmospheric overlay */
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(ellipse at center,
        rgba(0, 221, 255, 0.08) 0%,
        rgba(255, 0, 222, 0.06) 25%,
        rgba(0, 221, 255, 0.04) 50%,
        transparent 100%);
      opacity: 0.7;
      animation: atmospheric-shift 20s ease-in-out infinite;
      pointer-events: none;
      z-index: 1;
    }
    
    /* Center glow */
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 120%;
      height: 120%;
      transform: translate(-50%, -50%);
      background: radial-gradient(ellipse at center,
        rgba(0, 221, 255, 0.15) 0%,
        rgba(255, 0, 222, 0.1) 20%,
        rgba(0, 221, 255, 0.05) 40%,
        transparent 70%);
      filter: blur(60px);
      animation: glow-pulse 8s ease-in-out infinite;
      pointer-events: none;
      z-index: 2;
    }
  }
  
  @keyframes atmospheric-shift {
    0%, 100% {
      opacity: 0.7;
      transform: scale(1) rotate(0deg);
    }
    50% {
      opacity: 1;
      transform: scale(1.1) rotate(5deg);
    }
  }
  
  @keyframes glow-pulse {
    0%, 100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.5;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.2);
      opacity: 0.8;
    }
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

  .star {
    position: absolute;
    background: white;
    border-radius: 50%;
    filter: blur(1px);
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

  .loader-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    perspective: 1000px;
    transform-style: preserve-3d;
    z-index: 10;
    
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 600px;
      height: 600px;
      background: radial-gradient(circle,
        rgba(0, 221, 255, 0.6) 0%,
        rgba(255, 0, 222, 0.5) 30%,
        transparent 60%);
      filter: blur(80px);
      opacity: 1;
      animation: holo-glow 4s ease-in-out infinite alternate;
      pointer-events: none;
    }
  }
  
  @keyframes holo-glow {
    0% {
      transform: translate(-50%, -50%) scale(0.9);
      opacity: 0.4;
    }
    100% {
      transform: translate(-50%, -50%) scale(1.1);
      opacity: 0.7;
    }
  }

  .hologram-platform {
    position: absolute;
    width: 300px;
    height: 60px;
    bottom: -80px;
    border-radius: 50%;
    background: radial-gradient(
      ellipse,
      rgba(0, 221, 255, 0.3) 0%,
      rgba(0, 0, 0, 0) 70%
    );
    box-shadow: 0 0 30px rgba(0, 221, 255, 0.4);
    transform: rotateX(60deg);
    filter: blur(8px);
    animation: platform-glow 4s infinite alternate;
  }

  .platform-rings {
    position: absolute;
    width: 300px;
    height: 60px;
    bottom: -80px;
    transform: rotateX(60deg);
  }

  .platform-ring {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid transparent;
    opacity: 0.4;
    animation: platform-ring-pulse 4s infinite alternate;
  }

  .platform-ring:nth-child(1) {
    border-color: rgba(0, 221, 255, 0.4);
    animation-delay: -1s;
  }

  .platform-ring:nth-child(2) {
    width: 85%;
    height: 85%;
    top: 7.5%;
    left: 7.5%;
    border-color: rgba(255, 0, 255, 0.4);
    animation-delay: -2s;
  }

  .platform-ring:nth-child(3) {
    width: 70%;
    height: 70%;
    top: 15%;
    left: 15%;
    border-color: rgba(0, 221, 255, 0.4);
    animation-delay: -3s;
  }

  @keyframes platform-ring-pulse {
    0% {
      transform: scale(1);
      opacity: 0.2;
    }
    100% {
      transform: scale(1.05);
      opacity: 0.6;
    }
  }

  @keyframes platform-glow {
    0% {
      box-shadow: 0 0 30px rgba(0, 221, 255, 0.4);
      background: radial-gradient(
        ellipse,
        rgba(0, 221, 255, 0.3) 0%,
        rgba(0, 0, 0, 0) 70%
      );
    }
    100% {
      box-shadow: 0 0 50px rgba(255, 0, 255, 0.6);
      background: radial-gradient(
        ellipse,
        rgba(255, 0, 255, 0.3) 0%,
        rgba(0, 0, 0, 0) 70%
      );
    }
  }

  .holo-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 200px;
    transform-style: preserve-3d;
    animation: float-container 6s infinite ease-in-out;
  }

  @keyframes float-container {
    0%,
    100% {
      transform: translate(-50%, -50%) translateY(0);
    }
    50% {
      transform: translate(-50%, -50%) translateY(-20px);
    }
  }

  .metatron-sphere {
    position: relative;
    width: 220px;
    height: 220px;
    transform-style: preserve-3d;
    animation: rotate 20s infinite linear;
    display: flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(0 0 40px rgba(0,255,255,.8)) drop-shadow(0 0 80px rgba(255,0,255,.6)) drop-shadow(0 0 120px rgba(0,255,255,.4));
  }
  
  .metatron-sphere svg {
    width: 100%;
    height: 100%;
    animation: pulse 4s ease-in-out infinite, glow-shift 6s ease-in-out infinite;
  }
  
  @keyframes glow-shift {
    0%, 100% { filter: hue-rotate(0deg) saturate(1.2); }
    33% { filter: hue-rotate(-10deg) saturate(1.4); }
    66% { filter: hue-rotate(10deg) saturate(1.3); }
  }

  .holo-ring {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid transparent;
    box-shadow:
      0 0 20px rgba(255, 0, 222, 0.5),
      0 0 20px rgba(0, 221, 255, 0.5);
    filter: blur(1px);
    animation: pulse 3s infinite ease-in-out alternate;
    transform-style: preserve-3d;
  }

  .holo-ring:nth-child(1) {
    border-top-color: #ff00de;
    border-bottom-color: #00ddff;
    animation-delay: -0.5s;
  }

  .holo-ring:nth-child(2) {
    border-top-color: #00ddff;
    border-bottom-color: #ff00de;
    animation-delay: -1s;
    transform: rotateX(60deg);
  }

  .holo-ring:nth-child(3) {
    border-top-color: #ff00de;
    border-bottom-color: #00ddff;
    animation-delay: -1.5s;
    transform: rotateY(60deg);
  }

  .holo-ring:nth-child(4) {
    width: 90%;
    height: 90%;
    top: 5%;
    left: 5%;
    border-left-color: #00ff77;
    border-right-color: #ff5500;
    animation-delay: -2s;
    transform: rotateZ(45deg);
  }

  .holo-ring:nth-child(5) {
    width: 110%;
    height: 110%;
    top: -5%;
    left: -5%;
    border-left-color: #ff00b3;
    border-right-color: #3300ff;
    animation-delay: -2.5s;
    transform: rotateX(30deg) rotateY(30deg);
  }

  .energy-ring {
    position: absolute;
    width: 120%;
    height: 120%;
    top: -10%;
    left: -10%;
    border-radius: 50%;
    border: none;
    opacity: 0.5;
    transform-style: preserve-3d;
    animation: energy-rotation 10s infinite linear;
  }

  .energy-ring::before,
  .energy-ring::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: conic-gradient(
      transparent 0deg,
      rgba(0, 221, 255, 0.8) 20deg,
      transparent 40deg,
      transparent 140deg,
      rgba(255, 0, 222, 0.8) 160deg,
      transparent 180deg,
      transparent 280deg,
      rgba(0, 221, 255, 0.8) 300deg,
      transparent 320deg
    );
    filter: blur(2px);
    animation: energy-pulse 6s infinite alternate;
  }

  .energy-ring::after {
    transform: rotate(60deg);
    animation-delay: -3s;
  }

  @keyframes energy-rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes energy-pulse {
    0% {
      opacity: 0.3;
    }
    100% {
      opacity: 0.7;
    }
  }

  .holo-particles {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
  }

  .holo-particle {
    position: absolute;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.9) 0%,
      rgba(255, 255, 255, 0) 70%
    );
    border-radius: 50%;
    filter: blur(1px);
    opacity: 0;
    transform-style: preserve-3d;
    animation: particle-float 4s infinite ease-in-out;
  }

  .holo-particle:nth-child(1) {
    width: 8px;
    height: 8px;
    top: 20%;
    left: 30%;
    animation-delay: 0.1s;
  }

  .holo-particle:nth-child(2) {
    width: 6px;
    height: 6px;
    top: 70%;
    left: 60%;
    animation-delay: 0.7s;
  }

  .holo-particle:nth-child(3) {
    width: 10px;
    height: 10px;
    top: 40%;
    left: 80%;
    animation-delay: 1.3s;
  }

  .holo-particle:nth-child(4) {
    width: 5px;
    height: 5px;
    top: 80%;
    left: 25%;
    animation-delay: 1.9s;
  }

  .holo-particle:nth-child(5) {
    width: 7px;
    height: 7px;
    top: 30%;
    left: 50%;
    animation-delay: 2.5s;
  }

  .holo-particle:nth-child(6) {
    width: 9px;
    height: 9px;
    top: 60%;
    left: 40%;
    animation-delay: 3.1s;
  }

  .holo-particle:nth-child(7) {
    width: 4px;
    height: 4px;
    top: 50%;
    left: 75%;
    animation-delay: 3.7s;
  }

  .holo-particle:nth-child(8) {
    width: 8px;
    height: 8px;
    top: 25%;
    left: 85%;
    animation-delay: 4.3s;
  }

  @keyframes particle-float {
    0%,
    100% {
      transform: translateZ(0) translateX(0) translateY(0) scale(0.8);
      opacity: 0;
    }
    25% {
      opacity: 1;
      transform: translateZ(30px) translateX(10px) translateY(-10px) scale(1);
    }
    50% {
      transform: translateZ(60px) translateX(20px) translateY(-20px) scale(1.2);
      opacity: 0.8;
    }
    75% {
      opacity: 0.4;
      transform: translateZ(30px) translateX(10px) translateY(-10px) scale(1);
    }
  }

  .core {
    position: absolute;
    width: 50px;
    height: 50px;
    background: radial-gradient(
      circle,
      #ffffff 0%,
      rgba(255, 255, 255, 0.8) 30%,
      rgba(255, 255, 255, 0) 100%
    );
    border-radius: 50%;
    filter: blur(5px);
    animation: core-pulse 1.5s infinite ease-in-out alternate;
    z-index: 5;
    box-shadow:
      0 0 20px rgba(255, 255, 255, 0.8),
      0 0 40px rgba(0, 221, 255, 0.6),
      0 0 60px rgba(255, 0, 222, 0.4);
  }

  .core::before {
    content: "";
    position: absolute;
    width: 60px;
    height: 60px;
    top: -5px;
    left: -5px;
    border-radius: 50%;
    background: transparent;
    border: 2px solid rgba(255, 255, 255, 0.2);
    box-shadow: inset 0 0 15px rgba(255, 255, 255, 0.6);
    animation: core-rotate 3s infinite linear;
  }

  .core::after {
    content: "";
    position: absolute;
    width: 70px;
    height: 70px;
    top: -10px;
    left: -10px;
    border-radius: 50%;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: inset 0 0 10px rgba(0, 221, 255, 0.6);
    animation: core-rotate 5s infinite linear reverse;
  }

  @keyframes core-rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes core-pulse {
    0%,
    100% {
      transform: scale(0.8);
      opacity: 0.8;
      filter: blur(5px);
    }
    50% {
      transform: scale(1.3);
      opacity: 1;
      filter: blur(7px);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      filter: brightness(1) contrast(1.2);
    }
    50% {
      transform: scale(1.05);
      filter: brightness(1.3) contrast(1.4);
    }
  }

  .scan-line-horizontal {
    position: absolute;
    width: 100%;
    height: 3px;
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(255, 0, 222, 0.8) 20%,
      rgba(255, 255, 255, 1) 50%,
      rgba(0, 221, 255, 0.8) 80%,
      rgba(0, 0, 0, 0) 100%
    );
    animation: scan-horizontal 3s infinite linear;
    z-index: 10;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
  }

  .scan-line-vertical {
    position: absolute;
    height: 100%;
    width: 3px;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(255, 0, 222, 0.8) 20%,
      rgba(255, 255, 255, 1) 50%,
      rgba(0, 221, 255, 0.8) 80%,
      rgba(0, 0, 0, 0) 100%
    );
    animation: scan-vertical 3.5s infinite linear;
    z-index: 10;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
  }

  @keyframes scan-horizontal {
    0% {
      transform: translateY(-100px);
      opacity: 0;
    }
    20% {
      opacity: 0.8;
    }
    80% {
      opacity: 0.8;
    }
    100% {
      transform: translateY(100px);
      opacity: 0;
    }
  }

  @keyframes scan-vertical {
    0% {
      transform: translateX(-100px);
      opacity: 0;
    }
    20% {
      opacity: 0.8;
    }
    80% {
      opacity: 0.8;
    }
    100% {
      transform: translateX(100px);
      opacity: 0;
    }
  }

  .scan-data {
    position: absolute;
    font-size: 8px;
    color: rgba(0, 221, 255, 0.7);
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0;
    animation: scan-data 3s infinite linear;
    z-index: 10;
    transform-style: preserve-3d;
    text-shadow: 0 0 5px rgba(0, 221, 255, 0.5);
  }

  .scan-data:nth-child(1) {
    top: 30%;
    left: 65%;
    animation-delay: -0.5s;
  }

  .scan-data:nth-child(2) {
    top: 65%;
    left: 35%;
    animation-delay: -1.5s;
  }

  .scan-data:nth-child(3) {
    top: 20%;
    left: 40%;
    animation-delay: -2.5s;
  }

  @keyframes scan-data {
    0% {
      opacity: 0;
      transform: scale(0.8);
    }
    10%,
    90% {
      opacity: 0.8;
    }
    100% {
      opacity: 0;
      transform: scale(1.2);
    }
  }

  .hex-grid {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.3;
    background-image: linear-gradient(
        30deg,
        rgba(0, 221, 255, 0.5) 12%,
        transparent 12.5%,
        transparent 87%,
        rgba(0, 221, 255, 0.5) 87.5%,
        rgba(0, 221, 255, 0.5)
      ),
      linear-gradient(
        150deg,
        rgba(0, 221, 255, 0.5) 12%,
        transparent 12.5%,
        transparent 87%,
        rgba(0, 221, 255, 0.5) 87.5%,
        rgba(0, 221, 255, 0.5)
      ),
      linear-gradient(
        30deg,
        rgba(0, 221, 255, 0.5) 12%,
        transparent 12.5%,
        transparent 87%,
        rgba(0, 221, 255, 0.5) 87.5%,
        rgba(0, 221, 255, 0.5)
      ),
      linear-gradient(
        150deg,
        rgba(0, 221, 255, 0.5) 12%,
        transparent 12.5%,
        transparent 87%,
        rgba(0, 221, 255, 0.5) 87.5%,
        rgba(0, 221, 255, 0.5)
      ),
      linear-gradient(
        60deg,
        rgba(0, 221, 255, 0.2) 25%,
        transparent 25.5%,
        transparent 75%,
        rgba(0, 221, 255, 0.2) 75%,
        rgba(0, 221, 255, 0.2)
      ),
      linear-gradient(
        60deg,
        rgba(0, 221, 255, 0.2) 25%,
        transparent 25.5%,
        transparent 75%,
        rgba(0, 221, 255, 0.2) 75%,
        rgba(0, 221, 255, 0.2)
      );
    background-size: 20px 35px;
    background-position:
      0 0,
      0 0,
      10px 17.5px,
      10px 17.5px,
      0 0,
      10px 17.5px;
    animation: hex-pulse 4s infinite alternate;
    filter: drop-shadow(0 0 2px rgba(0, 221, 255, 0.5));
  }

  @keyframes hex-pulse {
    0% {
      opacity: 0.2;
      transform: scale(1);
    }
    100% {
      opacity: 0.4;
      transform: scale(1.1);
    }
  }

  .lightning {
    position: absolute;
    width: 100%;
    height: 100%;
    filter: blur(1px);
    transform-style: preserve-3d;
    opacity: 0;
    animation: lightning 5s infinite;
    z-index: 11;
  }

  @keyframes lightning {
    0%,
    100% {
      opacity: 0;
    }
    98% {
      opacity: 0;
    }
    99% {
      opacity: 0.8;
      filter: brightness(3);
    }
  }

  .lightning::before,
  .lightning::after {
    content: "";
    position: absolute;
    background: white;
    filter: blur(1px);
    box-shadow:
      0 0 10px #00ddff,
      0 0 20px rgba(255, 255, 255, 0.8);
  }

  .lightning::before {
    width: 3px;
    height: 100%;
    left: 50%;
    transform: translateX(-50%) rotateY(90deg);
    background: linear-gradient(
      180deg,
      rgba(0, 255, 255, 0) 0%,
      rgba(0, 255, 255, 1) 40%,
      white 50%,
      rgba(255, 0, 255, 1) 60%,
      rgba(255, 0, 255, 0) 100%
    );
  }

  .lightning::after {
    width: 100%;
    height: 3px;
    top: 50%;
    transform: translateY(-50%) rotateX(90deg);
    background: linear-gradient(
      90deg,
      rgba(0, 255, 255, 0) 0%,
      rgba(0, 255, 255, 1) 40%,
      white 50%,
      rgba(255, 0, 255, 1) 60%,
      rgba(255, 0, 255, 0) 100%
    );
  }

  .glitch-effect {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    animation: glitch 7s infinite;
    pointer-events: none;
    z-index: 12;
    background: linear-gradient(
      45deg,
      rgba(255, 0, 222, 0.3) 0%,
      transparent 20%,
      rgba(0, 221, 255, 0.3) 40%,
      transparent 60%,
      rgba(255, 0, 222, 0.3) 80%,
      transparent 100%
    );
  }

  @keyframes glitch {
    0%,
    100% {
      opacity: 0;
    }
    94%,
    96% {
      opacity: 0;
    }
    94.5% {
      opacity: 0.8;
      transform: translate(5px, -5px) skew(-5deg, 5deg);
    }
    95% {
      opacity: 0.8;
      transform: translate(-5px, 5px) skew(5deg, -5deg);
    }
    95.5% {
      opacity: 0.8;
      transform: translate(5px, 0) skew(-5deg, 0);
    }
  }

  .data-circle {
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    border: 1px solid rgba(0, 221, 255, 0.2);
    opacity: 0.7;
    transform-style: preserve-3d;
  }

  .data-circle::before {
    content: "";
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(0, 221, 255, 0.7);
    filter: blur(2px);
    animation: data-blip 5s infinite linear;
  }

  @keyframes data-blip {
    0% {
      transform: rotate(0deg) translateX(100px);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: rotate(360deg) translateX(100px);
      opacity: 0;
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .code-lines {
    position: absolute;
    width: 200%;
    height: 200%;
    top: -50%;
    left: -50%;
    pointer-events: none;
    perspective: 500px;
    transform-style: preserve-3d;
    z-index: 8;
  }

  .code-line {
    position: absolute;
    font-size: 10px;
    color: rgba(0, 221, 255, 0.7);
    white-space: nowrap;
    text-shadow: 0 0 5px rgba(0, 221, 255, 0.3);
    animation: code-scroll 15s infinite linear;
    opacity: 0;
  }

  .code-line:nth-child(1) {
    top: 10%;
    animation-duration: 14s;
    color: #00ddff;
  }

  .code-line:nth-child(2) {
    top: 20%;
    animation-duration: 15s;
    animation-delay: -1s;
  }

  .code-line:nth-child(3) {
    top: 30%;
    animation-duration: 16s;
    animation-delay: -2s;
    color: #ff00de;
  }

  .code-line:nth-child(4) {
    top: 40%;
    animation-duration: 14s;
    animation-delay: -3s;
  }

  .code-line:nth-child(5) {
    top: 50%;
    animation-duration: 10s;
    animation-delay: -3s;
  }

  .code-line:nth-child(6) {
    top: 60%;
    animation-duration: 13s;
    animation-delay: -7s;
    color: #ff00de;
  }

  .code-line:nth-child(7) {
    top: 70%;
    animation-duration: 11s;
    animation-delay: -4s;
  }

  .code-line:nth-child(8) {
    top: 80%;
    animation-duration: 16s;
    animation-delay: -9s;
    color: #ff00de;
  }

  @keyframes code-scroll {
    0% {
      transform: translateX(200px) rotateY(20deg);
      opacity: 0;
    }
    10% {
      opacity: 0.7;
    }
    90% {
      opacity: 0.7;
    }
    100% {
      transform: translateX(-500px) rotateY(20deg);
      opacity: 0;
    }
  }

  .corner-decorations {
    position: absolute;
    width: 300px;
    height: 300px;
    pointer-events: none;
  }

  .corner {
    position: absolute;
    width: 20px;
    height: 20px;
    border-style: solid;
    border-width: 2px;
    border-color: rgba(0, 221, 255, 0.5);
    animation: corner-pulse 3s infinite alternate;
  }

  .corner:nth-child(1) {
    top: 0;
    left: 0;
    border-right: none;
    border-bottom: none;
  }

  .corner:nth-child(2) {
    top: 0;
    right: 0;
    border-left: none;
    border-bottom: none;
  }

  .corner:nth-child(3) {
    bottom: 0;
    left: 0;
    border-right: none;
    border-top: none;
  }

  .corner:nth-child(4) {
    bottom: 0;
    right: 0;
    border-left: none;
    border-top: none;
  }

  @keyframes corner-pulse {
    0% {
      border-color: rgba(0, 221, 255, 0.5);
      width: 20px;
      height: 20px;
    }
    100% {
      border-color: rgba(255, 0, 222, 0.5);
      width: 30px;
      height: 30px;
    }
  }

  .projection-beams {
    position: absolute;
    width: 300px;
    height: 300px;
    bottom: -80px;
    transform-style: preserve-3d;
    opacity: 0.3;
    pointer-events: none;
  }

  .beam {
    position: absolute;
    width: 1px;
    height: 250px;
    background: linear-gradient(
      0deg,
      rgba(0, 221, 255, 0.8) 0%,
      rgba(255, 255, 255, 0.4) 40%,
      rgba(0, 0, 0, 0) 100%
    );
    bottom: 0;
    transform-origin: bottom;
    filter: blur(1px);
    opacity: 0.7;
  }

  .beam:nth-child(1) {
    left: 30%;
    transform: rotateY(10deg) rotateX(-30deg);
    animation: beam-flicker 4s infinite alternate;
    animation-delay: 0.5s;
  }

  .beam:nth-child(2) {
    left: 45%;
    transform: rotateY(-5deg) rotateX(-25deg);
    animation: beam-flicker 3s infinite alternate;
    animation-delay: 1.5s;
  }

  .beam:nth-child(3) {
    left: 55%;
    transform: rotateY(5deg) rotateX(-25deg);
    animation: beam-flicker 4s infinite alternate;
    animation-delay: 0.7s;
  }

  .beam:nth-child(4) {
    left: 70%;
    transform: rotateY(-10deg) rotateX(-30deg);
    animation: beam-flicker 3.5s infinite alternate;
    animation-delay: 2s;
  }

  @keyframes beam-flicker {
    0%,
    100% {
      opacity: 0.3;
    }
    50% {
      opacity: 0.7;
    }
  }

  .holo-ui {
    position: absolute;
    top: -150px;
    left: -350px;
    width: 200px;
    height: 300px;
    transform: rotateY(30deg);
    opacity: 0.7;
    pointer-events: none;
  }

  .ui-element {
    position: absolute;
    background: rgba(0, 221, 255, 0.2);
    border: 1px solid rgba(0, 221, 255, 0.5);
    border-radius: 4px;
    animation: ui-fade 3s infinite alternate;
  }

  .ui-element:nth-child(1) {
    top: 20px;
    left: 20px;
    width: 150px;
    height: 20px;
    animation-delay: 0.2s;
  }

  .ui-element:nth-child(2) {
    top: 50px;
    left: 20px;
    width: 100px;
    height: 100px;
    animation-delay: 0.4s;
  }

  .ui-element:nth-child(3) {
    top: 160px;
    left: 20px;
    width: 120px;
    height: 30px;
    animation-delay: 0.6s;
  }

  .ui-element:nth-child(4) {
    top: 200px;
    left: 20px;
    width: 80px;
    height: 80px;
    animation-delay: 0.8s;
  }

  @keyframes ui-fade {
    0% {
      opacity: 0.5;
      border-color: rgba(0, 221, 255, 0.5);
    }
    100% {
      opacity: 0.8;
      border-color: rgba(255, 0, 222, 0.5);
    }
  }

  .holo-ui-right {
    position: absolute;
    top: -150px;
    right: -350px;
    width: 200px;
    height: 300px;
    transform: rotateY(-30deg) scaleX(-1);
    opacity: 0.7;
    pointer-events: none;
  }

  .holo-numbers {
    position: absolute;
    width: 400px;
    height: 400px;
    transform-style: preserve-3d;
    perspective: 1000px;
    pointer-events: none;
  }

  .number {
    position: absolute;
    font-size: 10px;
    color: rgba(0, 221, 255, 0.8);
    text-shadow: 0 0 5px rgba(0, 221, 255, 0.6);
    animation: float-number 8s infinite linear;
    opacity: 0;
  }

  @keyframes float-number {
    0% {
      opacity: 0;
      transform: translateZ(100px) translateY(0);
    }
    10% {
      opacity: 0.7;
    }
    90% {
      opacity: 0.7;
    }
    100% {
      opacity: 0;
      transform: translateZ(-100px) translateY(-50px);
    }
  }

  .data-cube {
    position: absolute;
    width: 40px;
    height: 40px;
    transform-style: preserve-3d;
    animation: cube-rotate 10s infinite linear;
    top: -100px;
    right: -100px;
  }

  .cube-face {
    position: absolute;
    width: 40px;
    height: 40px;
    background: rgba(0, 221, 255, 0.1);
    border: 1px solid rgba(0, 221, 255, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: rgba(0, 221, 255, 0.8);
  }

  .cube-face:nth-child(1) {
    transform: translateZ(20px);
  }
  .cube-face:nth-child(2) {
    transform: rotateY(180deg) translateZ(20px);
  }
  .cube-face:nth-child(3) {
    transform: rotateY(90deg) translateZ(20px);
  }
  .cube-face:nth-child(4) {
    transform: rotateY(-90deg) translateZ(20px);
  }
  .cube-face:nth-child(5) {
    transform: rotateX(90deg) translateZ(20px);
  }
  .cube-face:nth-child(6) {
    transform: rotateX(-90deg) translateZ(20px);
  }

  @keyframes cube-rotate {
    0% {
      transform: rotateX(0) rotateY(0) rotateZ(0);
    }
    100% {
      transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
    }
  }

  .radial-indicators {
    position: absolute;
    width: 300px;
    height: 300px;
    pointer-events: none;
  }

  .radial-indicator {
    position: absolute;
    border-radius: 50%;
    border: 1px dashed rgba(0, 221, 255, 0.5);
    opacity: 0.3;
    animation: radial-pulse 4s infinite alternate;
  }

  .radial-indicator:nth-child(1) {
    width: 50px;
    height: 50px;
    top: calc(50% - 25px);
    left: calc(50% - 25px);
    animation-delay: 0.5s;
  }

  .radial-indicator:nth-child(2) {
    width: 100px;
    height: 100px;
    top: calc(50% - 50px);
    left: calc(50% - 50px);
    animation-delay: 1s;
  }

  .radial-indicator:nth-child(3) {
    width: 150px;
    height: 150px;
    top: calc(50% - 75px);
    left: calc(50% - 75px);
    animation-delay: 1.5s;
  }

  .radial-indicator:nth-child(4) {
    width: 200px;
    height: 200px;
    top: calc(50% - 100px);
    left: calc(50% - 100px);
    animation-delay: 2s;
  }

  @keyframes radial-pulse {
    0% {
      transform: scale(1);
      opacity: 0.2;
      border-color: rgba(0, 221, 255, 0.5);
    }
    100% {
      transform: scale(1.05);
      opacity: 0.5;
      border-color: rgba(255, 0, 222, 0.5);
    }
  }
  
  /* small: let the new first code-line stand out a touch */
  .code-lines .code-line:first-child {
    color: #64ffd1;
    text-shadow: 0 0 10px rgba(100,255,209,.6);
  }
`;

export default HolographicLoader;