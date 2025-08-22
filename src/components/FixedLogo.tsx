'use client';

import Image from 'next/image';
import { useState } from 'react';
import NavigationPanel from './navigation/NavigationPanel';
import { motion } from 'framer-motion';

export default function FixedLogo() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Logo position from your screenshot
  const logoConfig = {
    x: 207,
    y: 689,
    size: 109
  };

  return (
    <>
      {/* Navigation Panel */}
      <NavigationPanel isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

      {/* Interactive Logo */}
      <motion.div
        style={{
          position: 'fixed',
          left: `${logoConfig.x}px`,
          top: `${logoConfig.y}px`,
          width: `${logoConfig.size}px`,
          height: `${logoConfig.size}px`,
          zIndex: 99998,
          cursor: 'pointer',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsNavOpen(!isNavOpen)}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Image
          src="/kre8-logo.svg"
          alt="KRE8 Logo - Click to toggle navigation"
          width={logoConfig.size}
          height={logoConfig.size}
          priority
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: isHovered 
              ? 'drop-shadow(0 0 20px rgba(0, 221, 255, 0.8))' 
              : 'drop-shadow(0 0 10px rgba(0, 221, 255, 0.5))',
            transition: 'filter 0.3s ease'
          }}
        />
        
        {/* Tooltip on hover */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              position: 'absolute',
              bottom: '120%',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              border: '1px solid rgba(0, 221, 255, 0.5)',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '11px',
              color: '#00ddff',
              whiteSpace: 'nowrap',
              pointerEvents: 'none'
            }}
          >
            Click to toggle navigation
          </motion.div>
        )}
      </motion.div>
    </>
  );
}