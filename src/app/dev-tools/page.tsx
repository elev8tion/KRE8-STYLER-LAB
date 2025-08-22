'use client';

import { useState } from 'react';
import PlacementMarker from '@/components/PlacementMarker';
import HolographicBackground from '@/components/HolographicBackground';

export default function DevTools() {
  const [markerEnabled, setMarkerEnabled] = useState(true);
  const [logoPosition, setLogoPosition] = useState({ x: 100, y: 100, size: 119 });
  const [showLogo, setShowLogo] = useState(true);

  return (
    <>
      <HolographicBackground />
      <div className="min-h-screen relative z-10">
        {/* Control Panel */}
        <div className="fixed top-4 right-4 bg-gray-900/90 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 z-[9999]">
          <h2 className="text-xl font-bold text-cyan-400 mb-4">Dev Tools</h2>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-2 text-white">
                <input
                  type="checkbox"
                  checked={markerEnabled}
                  onChange={(e) => setMarkerEnabled(e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Show Placement Marker</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center space-x-2 text-white">
                <input
                  type="checkbox"
                  checked={showLogo}
                  onChange={(e) => setShowLogo(e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Show Logo Preview</span>
              </label>
            </div>
            
            <div className="pt-4 border-t border-cyan-500/20">
              <p className="text-sm text-gray-400 mb-2">Current Logo Position:</p>
              <div className="text-xs font-mono text-cyan-300">
                <div>X: {logoPosition.x}px</div>
                <div>Y: {logoPosition.y}px</div>
                <div>Size: {logoPosition.size}x{logoPosition.size}px</div>
              </div>
            </div>
          </div>
        </div>

        {/* Placement Marker */}
        {markerEnabled && (
          <PlacementMarker
            initialSize={119}
            label="Logo Position"
            onPositionChange={setLogoPosition}
          />
        )}

        {/* Logo Preview */}
        {showLogo && (
          <img
            src="/kre8styler-logo.svg"
            alt="KRE8Styler Logo Preview"
            style={{
              position: 'fixed',
              left: logoPosition.x,
              top: logoPosition.y,
              width: logoPosition.size,
              height: logoPosition.size,
              zIndex: 1000,
              opacity: 0.8,
              pointerEvents: 'none'
            }}
          />
        )}

        {/* Main Content Area - Sample Layout */}
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-magenta-400 mb-8">
            Development Tools & UI Positioning
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Cards to Test Logo Positioning */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i}
                className="bg-gray-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6"
              >
                <h3 className="text-xl text-cyan-400 mb-2">Sample Card {i}</h3>
                <p className="text-gray-300">
                  Use this layout to test logo positioning across different content layouts.
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 bg-gray-900/60 backdrop-blur-sm border border-magenta-500/30 rounded-2xl p-8">
            <h2 className="text-2xl text-magenta-400 mb-4">Positioning Strategy</h2>
            <p className="text-gray-300 mb-4">
              Use the placement marker to find the perfect universal position for the logo that works across all screens and layouts.
            </p>
            <ul className="space-y-2 text-gray-400">
              <li>• Drag the blue marker to position the logo</li>
              <li>• Use Size +/- buttons to adjust dimensions</li>
              <li>• Copy the CSS from the info panel</li>
              <li>• Test with different content layouts</li>
              <li>• Consider responsive positioning (from right edge)</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}