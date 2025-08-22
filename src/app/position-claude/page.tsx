'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTerminal, FiSettings, FiDatabase, FiCpu, FiZap, FiActivity, FiServer, FiGlobe, FiCode, FiBox } from 'react-icons/fi';
import HolographicBackground from '@/components/HolographicBackground';
import PlacementMarker from '@/components/PlacementMarker';

export default function PositionClaudeDashboard() {
  const [logoPosition, setLogoPosition] = useState({ x: 100, y: 20, size: 119 });
  const [showMarker, setShowMarker] = useState(true);
  const [savedPositions, setSavedPositions] = useState<any[]>([]);

  // Save position to localStorage
  const savePosition = () => {
    const positionData = {
      ...logoPosition,
      timestamp: new Date().toISOString(),
      page: 'claude-dashboard'
    };
    
    const existing = JSON.parse(localStorage.getItem('logo-positions') || '[]');
    existing.push(positionData);
    localStorage.setItem('logo-positions', JSON.stringify(existing));
    setSavedPositions(existing);
    
    // Also save as the current position
    localStorage.setItem('claude-logo-position', JSON.stringify(logoPosition));
    
    alert(`Position saved! 
X: ${logoPosition.x}px
Y: ${logoPosition.y}px
Size: ${logoPosition.size}px`);
  };

  useEffect(() => {
    // Load saved position if exists
    const saved = localStorage.getItem('claude-logo-position');
    if (saved) {
      setLogoPosition(JSON.parse(saved));
    }
    
    // Load all saved positions
    const allSaved = localStorage.getItem('logo-positions');
    if (allSaved) {
      setSavedPositions(JSON.parse(allSaved));
    }
  }, []);

  return (
    <>
      <HolographicBackground />
      
      {/* EXACT REPLICA OF CLAUDE DASHBOARD LAYOUT */}
      <div className="flex h-screen bg-gradient-to-br from-gray-950/50 via-gray-900/40 to-gray-950/50 relative z-10">
        
        {/* Left Panel - Status and Info */}
        <motion.div 
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="w-80 bg-gray-900/40 border-r border-cyan-900/30 p-6 flex flex-col"
        >
          <div className="mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-magenta-400 bg-clip-text text-transparent font-orbitron tracking-wider">
              Claude Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-1">MCP Integration Terminal</p>
          </div>

          {/* MCP Status */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">MCP Bridge Status</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-400">Connected</span>
              </div>
            </div>
            <div className="bg-gray-800/60 rounded-lg p-3 border border-cyan-700/30">
              <div className="text-xs text-gray-400">Port: 3002</div>
              <div className="text-xs text-gray-400">Tools: 42 Available</div>
              <div className="text-xs text-gray-400">Latency: 12ms</div>
            </div>
          </div>

          {/* Available Models */}
          <div className="mb-6">
            <h3 className="text-sm text-gray-400 mb-3">Active Models</h3>
            <div className="space-y-2">
              <div className="bg-gradient-to-r from-cyan-900/30 to-magenta-900/30 rounded-lg p-3 border border-cyan-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FiCpu className="text-cyan-400" />
                    <span className="text-sm">Claude 3 Opus</span>
                  </div>
                  <FiZap className="text-yellow-400 text-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="mb-6">
            <h3 className="text-sm text-gray-400 mb-3">Quick Tools</h3>
            <div className="grid grid-cols-3 gap-2">
              {[FiCode, FiDatabase, FiServer, FiGlobe, FiActivity, FiBox].map((Icon, i) => (
                <button 
                  key={i}
                  className="bg-gray-800/60 hover:bg-cyan-900/30 p-3 rounded-lg border border-cyan-700/30 flex items-center justify-center transition-colors"
                >
                  <Icon className="text-cyan-400" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Center - Main Terminal Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-8">
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-cyan-700/30 h-full p-6 shadow-2xl shadow-cyan-900/20">
              <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-cyan-700/30">
                <FiTerminal className="text-cyan-400 text-xl" />
                <h2 className="text-lg font-semibold text-cyan-400">Claude Terminal</h2>
                <div className="flex-1" />
                <button className="p-2 hover:bg-cyan-900/30 rounded-lg transition-colors">
                  <FiSettings className="text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-4 font-mono text-sm">
                <div className="text-green-400">$ Claude MCP Bridge initialized...</div>
                <div className="text-gray-400">→ Connected to port 3002</div>
                <div className="text-gray-400">→ 42 tools registered</div>
                <div className="text-cyan-400">$ Ready for commands</div>
                <div className="flex items-center">
                  <span className="text-cyan-400 mr-2">❯</span>
                  <div className="w-2 h-4 bg-cyan-400 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Tool Gallery */}
        <motion.div 
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          className="w-96 bg-gray-900/40 border-l border-cyan-900/30 p-6"
        >
          <h3 className="text-lg font-semibold text-cyan-400 mb-6">Visual Tools</h3>
          
          <div className="space-y-4">
            <div className="bg-gray-800/60 rounded-xl p-4 border border-cyan-700/30">
              <h4 className="text-sm font-medium text-gray-300 mb-3">File Operations</h4>
              <div className="grid grid-cols-4 gap-2">
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} className="aspect-square bg-gradient-to-br from-cyan-900/30 to-magenta-900/30 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* POSITIONING CONTROLS */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/95 backdrop-blur-sm border border-cyan-500/50 rounded-2xl p-6 z-[10002] shadow-2xl shadow-cyan-900/50">
        <h3 className="text-lg font-bold text-cyan-400 mb-4 text-center">Logo Positioning Controls</h3>
        
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setShowMarker(!showMarker)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              showMarker 
                ? 'bg-gradient-to-r from-cyan-600 to-magenta-600 text-white shadow-lg shadow-cyan-900/50' 
                : 'bg-gray-800 text-gray-400 border border-gray-700'
            }`}
          >
            {showMarker ? '✓ Marker ON' : 'Marker OFF'}
          </button>
          
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">Current Position</div>
            <div className="font-mono text-cyan-300">
              X: {logoPosition.x} | Y: {logoPosition.y} | Size: {logoPosition.size}
            </div>
          </div>
          
          <button
            onClick={savePosition}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg shadow-green-900/50 hover:scale-105 transition-transform"
          >
            💾 Save Position
          </button>
        </div>
        
        <div className="mt-4 text-center text-xs text-gray-500">
          Drag the marker to position the logo • Adjust size with +/- buttons
        </div>
      </div>

      {/* PLACEMENT MARKER */}
      {showMarker && (
        <PlacementMarker
          initialSize={logoPosition.size}
          label="Logo Position"
          onPositionChange={setLogoPosition}
        />
      )}

      {/* LOGO PREVIEW */}
      <img
        src="/kre8styler-logo.svg"
        alt="KRE8Styler Logo"
        style={{
          position: 'fixed',
          left: logoPosition.x,
          top: logoPosition.y,
          width: logoPosition.size,
          height: logoPosition.size,
          zIndex: 1000,
          opacity: 0.9,
          pointerEvents: 'none'
        }}
      />
    </>
  );
}