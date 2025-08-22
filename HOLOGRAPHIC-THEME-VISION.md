# HOLOGRAPHIC THEME VISION - The Lab

## Core Design System
This holographic loader component defines the entire visual language for The Lab.

### Color Palette (From Loader)
- **Primary Cyan**: #00ddff (0, 221, 255)
- **Primary Magenta**: #ff00de (255, 0, 222)
- **Accent Green**: #00ff77
- **Accent Orange**: #ff5500
- **Pure White**: #ffffff (for cores/highlights)
- **Deep Space Black**: Base background

### Visual Elements to Carry Through
1. **Holographic Rings** - Rotating, pulsing orbital elements
2. **Grid Planes** - Perspective grid backgrounds
3. **Particle Systems** - Floating, glowing particles
4. **Energy Beams** - Projection/connection lines
5. **Scan Lines** - Horizontal/vertical scanning effects
6. **Code Scrolling** - Binary/code flowing in background
7. **Lightning Effects** - Occasional energy bursts
8. **Glitch Effects** - Subtle digital distortions
9. **Nebula Backgrounds** - Gradient color clouds
10. **Corner Decorations** - Tech frame elements

### Animation Principles
- Continuous rotation (15s cycles)
- Floating/breathing effects (6s cycles)
- Pulse animations (3-4s cycles)
- Scan movements (3-5s cycles)
- Particle drift (various speeds)
- Lightning strikes (rare, 5s intervals)
- Glitch moments (7s intervals)

### Typography Style
- Uppercase for system text
- Letter spacing: 1-2px
- Text shadows with glow effects
- Monospace for code/data
- Size hierarchy: 8px (data) to 14px (headers)

### Component Integration Rules
- All backgrounds inherit nebula/grid system
- Buttons get holographic ring treatment
- Cards have projection beam foundations
- Modals emerge with lightning effect
- Loading states use the core sphere
- Navigation has scan line indicators
- Data displays get floating particles

## Voice Mode Integration Vision

### Bidirectional Voice Experience
- **You speak** → Visual waveform appears in holographic style
- **Claude processes** → Core sphere pulses/rotates faster
- **Claude responds** → Voice with particle emanation effects

### Voice UI Elements
- Floating voice orb (always accessible)
- Voice waveform visualization in theme colors
- Status rings that pulse with speech
- Particle effects during listening
- Energy beams connecting voice to active panel

### Voice Personalities by Context
- **Code Review**: Professional, measured tone with blue energy
- **Debugging**: Calm, supportive with green particles
- **Success Events**: Excited with rainbow lightning effects
- **Errors**: Gentle, problem-solving with soft red glow
- **Experimental Areas**: Playful with random color bursts

## Implementation Priority
1. Install styled-components for the loader
2. Create base theme provider with colors/animations
3. Replace existing backgrounds with holographic system
4. Integrate loader as main loading state
5. Apply theme to all existing components
6. Add voice mode MCP integration
7. Create voice UI overlay system

## Technical Notes
- This loader uses styled-components (need to install)
- All animations are GPU-accelerated (transform/opacity)
- Theme should be responsive and performant
- Voice integration via existing MCP WebSocket bridge

## The Vision
Transform The Lab into a living, breathing holographic command center where:
- Every interaction feels like manipulating energy
- Voice creates a true AI presence
- Visual beauty matches functional power
- The interface itself becomes the experience

This isn't just a dashboard - it's a portal into the future of human-AI collaboration.