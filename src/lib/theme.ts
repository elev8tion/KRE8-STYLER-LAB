export const holoTheme = {
  colors: {
    primaryCyan: '#00ddff',
    primaryMagenta: '#ff00de',
    accentGreen: '#00ff77',
    accentOrange: '#ff5500',
    accentLime: '#B3FF10',
    pureWhite: '#ffffff',
    deepSpaceBlack: '#000000',
    darkBlue: 'rgba(10, 10, 30, 0.6)',
    glowCyan: 'rgba(0, 221, 255, 0.8)',
    glowMagenta: 'rgba(255, 0, 222, 0.8)',
  },
  borderRadius: {
    primary: '24px',
    secondary: '32px',
    minimal: '8px',
    none: '0px',
  },
  animation: {
    rotation: '16s',
    floating: '8s',
    pulse: '4s',
    scan: '8s',
    particleDrift: '3s',
    lightning: '5s',
    glitch: '8s',
  },
  typography: {
    fontFamily: {
      headers: '"Orbitron", sans-serif',
      body: '"Inter", system-ui, sans-serif',
      mono: '"Fira Code", monospace',
    },
    letterSpacing: {
      headers: '2px',
      body: '1px',
      wide: '3px',
    },
  },
  shadows: {
    glow: {
      cyan: '0 0 20px rgba(0, 221, 255, 0.8)',
      magenta: '0 0 20px rgba(255, 0, 222, 0.8)',
      white: '0 0 20px rgba(255, 255, 255, 0.8)',
    },
    text: {
      cyan: '0 0 10px rgba(0, 221, 255, 0.5)',
      magenta: '0 0 10px rgba(255, 0, 222, 0.5)',
      white: '0 0 15px rgba(255, 255, 255, 0.8)',
    },
  },
  gradients: {
    holographic: 'linear-gradient(135deg, #00ddff 0%, #ff00de 50%, #00ff77 100%)',
    nebula: `radial-gradient(ellipse at 30% 30%, rgba(63, 0, 113, 0.3) 0%, transparent 70%),
             radial-gradient(ellipse at 70% 60%, rgba(0, 113, 167, 0.3) 0%, transparent 70%)`,
    darkPanel: 'linear-gradient(45deg, rgba(0, 0, 40, 0.8) 0%, rgba(0, 20, 50, 0.8) 50%, rgba(5, 10, 30, 0.8) 100%)',
  },
}