'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ParticleCard from './ParticleCard';
import { 
  Box, Shield, Cpu, Database, Terminal, Zap, Code2, Layers, Cloud
} from 'lucide-react';

interface ComponentTemplate {
  name: string;
  icon: React.ReactNode;
  category: string;
  code: string;
  css: string;
}

const templates: ComponentTemplate[] = [
  // KRE8 Cyber Components
  {
    name: 'Cyber Hero',
    icon: <Shield className="w-4 h-4" />,
    category: 'Heroes',
    code: `function CyberHero() {
  const [glitching, setGlitching] = useState(false);
  
  return (
    <div className="cyber-hero" onMouseEnter={() => setGlitching(true)} onMouseLeave={() => setGlitching(false)}>
      <div className={glitching ? 'glitch' : ''}>
        <h1 className="cyber-title">KRE8 CYBER</h1>
        <p className="cyber-subtitle">Welcome to the future</p>
      </div>
      <div className="cyber-grid"></div>
      <button className="cyber-btn">
        <span>ENTER SYSTEM</span>
        <span className="cyber-btn-glow"></span>
      </button>
    </div>
  );
}`,
    css: `.cyber-hero {
  position: relative;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a0033 100%);
  border: 1px solid rgba(0, 221, 255, 0.3);
  border-radius: 0.5rem;
  overflow: hidden;
}

.cyber-title {
  font-size: 4rem;
  font-weight: bold;
  background: linear-gradient(90deg, #00ddff, #aa00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  letter-spacing: 0.2em;
}

.glitch {
  animation: glitch 0.3s infinite;
}

@keyframes glitch {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-1px, 1px); }
  40% { transform: translate(1px, -1px); }
  60% { transform: translate(-1px, -1px); }
  80% { transform: translate(1px, 1px); }
}

.cyber-subtitle {
  color: rgba(0, 221, 255, 0.8);
  text-align: center;
  margin-top: 1rem;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
}

.cyber-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0, 221, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 221, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
}

.cyber-btn {
  position: relative;
  margin: 2rem auto;
  display: block;
  padding: 1rem 3rem;
  background: linear-gradient(135deg, #00ddff 0%, #aa00ff 100%);
  border: none;
  color: white;
  font-weight: bold;
  letter-spacing: 0.1em;
  cursor: pointer;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  transition: all 0.3s;
}

.cyber-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.2);
}

.cyber-btn-glow {
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, #00ddff, #aa00ff);
  filter: blur(10px);
  opacity: 0.5;
  z-index: -1;
}`
  },
  
  // Holographic Card
  {
    name: 'Holo Card',
    icon: <Box className="w-4 h-4" />,
    category: 'Cards',
    code: `function HoloCard() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setRotation({ x: (y - 0.5) * 20, y: (x - 0.5) * -20 });
  };
  
  return (
    <div 
      className="holo-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setRotation({ x: 0, y: 0 })}
      style={{
        transform: \`perspective(1000px) rotateX(\${rotation.x}deg) rotateY(\${rotation.y}deg)\`
      }}
    >
      <div className="holo-shine"></div>
      <h3 className="holo-title">Holographic Interface</h3>
      <p className="holo-text">Experience the future of UI</p>
      <div className="holo-stats">
        <div className="stat">
          <span className="stat-value">99.9%</span>
          <span className="stat-label">Uptime</span>
        </div>
        <div className="stat">
          <span className="stat-value">24/7</span>
          <span className="stat-label">Support</span>
        </div>
      </div>
    </div>
  );
}`,
    css: `.holo-card {
  position: relative;
  padding: 2rem;
  background: linear-gradient(135deg, 
    rgba(138, 43, 226, 0.1),
    rgba(0, 221, 255, 0.1),
    rgba(138, 43, 226, 0.1));
  border: 1px solid rgba(138, 43, 226, 0.3);
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  transition: transform 0.1s;
  overflow: hidden;
}

.holo-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 35%,
    rgba(255, 255, 255, 0.1) 40%,
    rgba(255, 255, 255, 0.1) 42%,
    transparent 47%
  );
  animation: shine 3s infinite;
}

@keyframes shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.holo-title {
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(90deg, #aa00ff, #00ddff, #aa00ff);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient 3s linear infinite;
  margin-bottom: 0.5rem;
}

@keyframes gradient {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}

.holo-text {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
}

.holo-stats {
  display: flex;
  gap: 2rem;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #00ddff;
}

.stat-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
}`
  },

  // Neural Network Button
  {
    name: 'Neural Button',
    icon: <Cpu className="w-4 h-4" />,
    category: 'Buttons',
    code: `function NeuralButton() {
  const [active, setActive] = useState(false);
  
  return (
    <button 
      className={\`neural-btn \${active ? 'active' : ''}\`}
      onClick={() => setActive(!active)}
    >
      <span className="neural-text">ACTIVATE</span>
      <div className="neural-network">
        <div className="node node-1"></div>
        <div className="node node-2"></div>
        <div className="node node-3"></div>
        <div className="node node-4"></div>
      </div>
    </button>
  );
}`,
    css: `.neural-btn {
  position: relative;
  padding: 1rem 2.5rem;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid rgba(0, 221, 255, 0.5);
  border-radius: 0.5rem;
  color: #00ddff;
  font-weight: bold;
  letter-spacing: 0.1em;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s;
}

.neural-btn:hover {
  border-color: #00ddff;
  box-shadow: 0 0 20px rgba(0, 221, 255, 0.5);
}

.neural-btn.active {
  background: rgba(0, 221, 255, 0.1);
  border-color: #aa00ff;
  color: #aa00ff;
}

.neural-text {
  position: relative;
  z-index: 2;
}

.neural-network {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.node {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #00ddff;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.node-1 { top: 20%; left: 10%; animation-delay: 0s; }
.node-2 { top: 60%; left: 30%; animation-delay: 0.5s; }
.node-3 { top: 40%; right: 20%; animation-delay: 1s; }
.node-4 { bottom: 20%; right: 10%; animation-delay: 1.5s; }

@keyframes pulse {
  0%, 100% { 
    opacity: 0.3;
    transform: scale(1);
  }
  50% { 
    opacity: 1;
    transform: scale(2);
  }
}`
  },

  // Data Stream
  {
    name: 'Data Stream',
    icon: <Database className="w-4 h-4" />,
    category: 'Data',
    code: `function DataStream() {
  const [data] = useState([
    { id: 1, value: 85, label: 'CPU' },
    { id: 2, value: 62, label: 'RAM' },
    { id: 3, value: 93, label: 'GPU' },
    { id: 4, value: 41, label: 'DISK' }
  ]);
  
  return (
    <div className="data-stream">
      <h3 className="stream-title">System Monitor</h3>
      <div className="stream-grid">
        {data.map(item => (
          <div key={item.id} className="stream-item">
            <div className="stream-label">{item.label}</div>
            <div className="stream-bar">
              <div 
                className="stream-fill"
                style={{ width: \`\${item.value}%\` }}
              ></div>
            </div>
            <div className="stream-value">{item.value}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}`,
    css: `.data-stream {
  padding: 1.5rem;
  background: rgba(10, 10, 10, 0.9);
  border: 1px solid rgba(0, 221, 255, 0.2);
  border-radius: 0.5rem;
}

.stream-title {
  font-size: 1.2rem;
  color: #00ddff;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.stream-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stream-item {
  display: grid;
  grid-template-columns: 60px 1fr 50px;
  align-items: center;
  gap: 1rem;
}

.stream-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  font-weight: bold;
}

.stream-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.stream-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ddff, #aa00ff);
  border-radius: 4px;
  animation: pulse-width 2s ease-in-out infinite;
}

@keyframes pulse-width {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

.stream-value {
  color: #00ddff;
  font-weight: bold;
  text-align: right;
}`
  },

  // Glitch Button
  {
    name: 'Glitch Button',
    icon: <Zap className="w-4 h-4" />,
    category: 'Buttons',
    code: `function GlitchButton() {
  const [isGlitching, setIsGlitching] = useState(false);
  
  return (
    <button 
      className={\`glitch-btn \${isGlitching ? 'glitching' : ''}\`}
      onMouseEnter={() => setIsGlitching(true)}
      onMouseLeave={() => setIsGlitching(false)}
    >
      <span data-text="EXECUTE">EXECUTE</span>
    </button>
  );
}`,
    css: `.glitch-btn {
  position: relative;
  padding: 1.2rem 3rem;
  background: linear-gradient(45deg, #00ffcc, #00ccff);
  border: none;
  color: #000;
  font-weight: 900;
  font-size: 1.2rem;
  letter-spacing: 2px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s;
  clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px));
}

.glitch-btn:hover {
  transform: scale(1.05);
  filter: brightness(1.2);
}

.glitch-btn.glitching span {
  animation: glitch-anim 0.3s infinite;
}

.glitch-btn.glitching span::before,
.glitch-btn.glitching span::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.glitch-btn.glitching span::before {
  animation: glitch-anim-1 0.2s infinite;
  color: #00ffcc;
  z-index: -1;
}

.glitch-btn.glitching span::after {
  animation: glitch-anim-2 0.2s infinite;
  color: #ff00cc;
  z-index: -2;
}

@keyframes glitch-anim {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(2px, -2px); }
  60% { transform: translate(-2px, -2px); }
}

@keyframes glitch-anim-1 {
  0%, 100% { clip-path: inset(0 0 100% 0); }
  25% { clip-path: inset(0 0 50% 0); }
  50% { clip-path: inset(50% 0 0 0); }
  75% { clip-path: inset(0 0 30% 0); }
}

@keyframes glitch-anim-2 {
  0%, 100% { clip-path: inset(100% 0 0 0); }
  25% { clip-path: inset(50% 0 0 0); }
  50% { clip-path: inset(0 0 50% 0); }
  75% { clip-path: inset(30% 0 0 0); }
}`
  },

  // Matrix Rain
  {
    name: 'Matrix Rain',
    icon: <Code2 className="w-4 h-4" />,
    category: 'Effects',
    code: `function MatrixRain() {
  const [drops, setDrops] = useState([]);
  
  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()';
    const newDrops = Array.from({length: 20}, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      chars: Array.from({length: 15}, () => chars[Math.floor(Math.random() * chars.length)])
    }));
    setDrops(newDrops);
  }, []);
  
  return (
    <div className="matrix-container">
      {drops.map(drop => (
        <div 
          key={drop.id} 
          className="matrix-drop"
          style={{
            left: \`\${drop.x}%\`,
            animationDelay: \`\${drop.delay}s\`,
            animationDuration: \`\${drop.duration}s\`
          }}
        >
          {drop.chars.map((char, i) => (
            <span key={i} style={{opacity: 1 - (i * 0.06)}}>{char}</span>
          ))}
        </div>
      ))}
    </div>
  );
}`,
    css: `.matrix-container {
  position: relative;
  width: 100%;
  height: 300px;
  background: #000;
  overflow: hidden;
  border-radius: 10px;
}

.matrix-drop {
  position: absolute;
  top: -100%;
  color: #00ff00;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.2;
  animation: matrix-fall linear infinite;
  text-shadow: 0 0 5px #00ff00;
}

.matrix-drop span {
  display: block;
}

@keyframes matrix-fall {
  to {
    top: 100%;
  }
}`
  },

  // Neon Card
  {
    name: 'Neon Card',
    icon: <Layers className="w-4 h-4" />,
    category: 'Cards',
    code: `function NeonCard() {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="neon-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="neon-border"></div>
      <div className="neon-content">
        <h3>NEON VIBES</h3>
        <p>Cyberpunk aesthetic card with animated borders</p>
      </div>
    </div>
  );
}`,
    css: `.neon-card {
  position: relative;
  width: 300px;
  height: 200px;
  background: #0a0a0a;
  border-radius: 15px;
  overflow: hidden;
}

.neon-border {
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, #00ffcc, #ff00cc, #ffcc00, #00ccff);
  border-radius: 15px;
  animation: rotate 3s linear infinite;
  z-index: -1;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.neon-card::before {
  content: '';
  position: absolute;
  inset: 2px;
  background: #0a0a0a;
  border-radius: 13px;
  z-index: 1;
}

.neon-content {
  position: relative;
  z-index: 2;
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.neon-content h3 {
  color: #00ffcc;
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 0 0 20px #00ffcc;
}

.neon-content p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}`
  },

  // Terminal Interface
  {
    name: 'Terminal UI',
    icon: <Terminal className="w-4 h-4" />,
    category: 'Interfaces',
    code: `function TerminalUI() {
  const [lines, setLines] = useState([
    { type: 'info', text: 'System initialized...' },
    { type: 'success', text: 'Connection established' },
    { type: 'warning', text: 'High memory usage detected' }
  ]);
  const [input, setInput] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setLines([...lines, { type: 'command', text: '> ' + input }]);
      setInput('');
    }
  };
  
  return (
    <div className="terminal">
      <div className="terminal-header">
        <span className="terminal-title">KRE8 Terminal v1.0</span>
        <div className="terminal-controls">
          <span className="control control-min"></span>
          <span className="control control-max"></span>
          <span className="control control-close"></span>
        </div>
      </div>
      <div className="terminal-body">
        {lines.map((line, i) => (
          <div key={i} className={\`terminal-line \${line.type}\`}>
            {line.text}
          </div>
        ))}
        <form onSubmit={handleSubmit} className="terminal-input-wrap">
          <span className="terminal-prompt">❯</span>
          <input
            type="text"
            className="terminal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter command..."
          />
        </form>
      </div>
    </div>
  );
}`,
    css: `.terminal {
  background: #0a0a0a;
  border: 1px solid rgba(0, 221, 255, 0.3);
  border-radius: 0.5rem;
  overflow: hidden;
  font-family: 'Fira Code', monospace;
}

.terminal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: rgba(0, 221, 255, 0.1);
  border-bottom: 1px solid rgba(0, 221, 255, 0.2);
}

.terminal-title {
  color: #00ddff;
  font-size: 0.9rem;
  font-weight: bold;
}

.terminal-controls {
  display: flex;
  gap: 0.5rem;
}

.control {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
}

.control-min { background: #ffaa00; }
.control-max { background: #00ff00; }
.control-close { background: #ff0055; }

.terminal-body {
  padding: 1rem;
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
}

.terminal-line {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.terminal-line.info { color: #00ddff; }
.terminal-line.success { color: #00ff88; }
.terminal-line.warning { color: #ffaa00; }
.terminal-line.command { color: #ffffff; }

.terminal-input-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.terminal-prompt {
  color: #00ddff;
  font-weight: bold;
}

.terminal-input {
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  outline: none;
  font-family: inherit;
}`
  }
];

interface Props {
  onSelectTemplate: (template: ComponentTemplate) => void;
  isOpen: boolean;
  embedded?: boolean;
}

export default function KRE8ComponentLibrary({ onSelectTemplate, isOpen, embedded = false }: Props) {
  const categories = [...new Set(templates.map(t => t.category))];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Color mapping for categories
  const categoryColors: { [key: string]: string } = {
    'Heroes': '#00ffcc',
    'Cards': '#ff00ff',
    'Buttons': '#00ff88',
    'Data': '#ff9900',
    'Interfaces': '#00ccff',
    'Effects': '#ffcc00'
  };

  if (embedded) {
    return (
      <div className="w-full h-full overflow-y-auto">
        {/* Category Filter - Circular Button Style */}
        <div className="flex gap-4 mb-6 pt-8 px-4 justify-center">
          {/* All button */}
          <motion.button
            onClick={() => setSelectedCategory(null)}
            className="relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className={`
              w-16 h-16 rounded-full
              bg-gradient-to-br from-cyan-500/20 to-purple-500/20
              border-2 ${!selectedCategory ? 'border-cyan-400' : 'border-cyan-500/40'}
              flex items-center justify-center
              text-cyan-400 font-bold text-xs
              transition-all duration-300
              ${!selectedCategory ? 'shadow-[0_0_30px_rgba(0,255,204,0.5)]' : 'hover:shadow-[0_0_20px_rgba(0,255,204,0.3)]'}
            `}>
              ALL
            </div>
          </motion.button>

          {/* Category buttons */}
          {categories.map(category => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div 
                className={`
                  w-16 h-16 rounded-full
                  bg-black/60 backdrop-blur-sm
                  border-2 transition-all duration-300
                  flex items-center justify-center
                  font-bold text-[10px]
                  ${selectedCategory === category 
                    ? 'shadow-[0_0_30px_rgba(0,255,204,0.5)]' 
                    : 'hover:shadow-[0_0_20px_rgba(0,255,204,0.3)]'}
                `}
                style={{
                  borderColor: selectedCategory === category 
                    ? categoryColors[category] 
                    : `${categoryColors[category]}66`,
                  color: categoryColors[category],
                  textShadow: selectedCategory === category 
                    ? `0 0 10px ${categoryColors[category]}` 
                    : 'none'
                }}
              >
                {category.slice(0, 3).toUpperCase()}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Template Grid with Particle Cards - Centered */}
        <div className="flex justify-center items-start min-h-full px-8 pb-4" style={{ marginTop: '75px' }}>
          <div className="grid grid-cols-3 gap-x-12 gap-y-8 max-w-[700px]">
            {templates
              .filter(t => !selectedCategory || t.category === selectedCategory)
              .map((template, index) => (
                <motion.div
                  key={template.name}
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    rotate: 0,
                    transition: {
                      delay: index * 0.05,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 200
                    }
                  }}
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <ParticleCard
                    text={template.name}
                    color={categoryColors[template.category] || '#00ffcc'}
                    icon={template.icon}
                    onClick={() => onSelectTemplate(template)}
                  />
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: isOpen ? 0 : -300 }}
      className="fixed left-0 top-0 h-full w-80 bg-gray-950/95 backdrop-blur-xl border-r border-cyan-500/20 z-40 overflow-y-auto"
      style={{ marginTop: '60px' }}
    >
      <div className="p-4">
        <h2 className="text-xl font-bold text-cyan-400 mb-4">Component Library</h2>
        
        {categories.map(category => (
          <div key={category} className="mb-6">
            <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3">
              {category}
            </h3>
            <div className="space-y-2">
              {templates
                .filter(t => t.category === category)
                .map(template => (
                  <motion.button
                    key={template.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectTemplate(template)}
                    className="w-full flex items-center gap-3 p-3 bg-gray-900/50 hover:bg-gray-900/80 border border-cyan-500/10 hover:border-cyan-500/30 rounded-lg transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-cyan-400">
                      {template.icon}
                    </div>
                    <span className="text-gray-300 text-sm font-medium">
                      {template.name}
                    </span>
                  </motion.button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}