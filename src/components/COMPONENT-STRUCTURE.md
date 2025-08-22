# Component Structure Organization

## 📁 Folder Structure

```
components/
├── backgrounds/      # Background effects and animations
│   └── HolographicBackground.tsx
│
├── buttons/         # All button components
│   ├── AnimatedButton.tsx
│   ├── CyberButton.tsx
│   └── HoloButton.tsx
│
├── cards/          # Card components
│   ├── AnimatedCard.tsx
│   └── CyberCard.tsx
│
├── navigation/     # Navigation components
│   └── NavigationPanel.tsx
│
├── tools/         # Tool panels and utilities
│   ├── ClaudePanel.tsx
│   ├── ClaudeTerminal.tsx
│   ├── ToolPanel.tsx
│   ├── PlacementMarker.tsx
│   └── DraggableMarker.tsx
│
├── ui/           # General UI components
│   ├── AnimatedInput.tsx
│   ├── HoloSwitch.tsx
│   ├── MagneticCursor.tsx
│   └── HolographicLoader.tsx
│
├── layouts/      # Layout components
│   └── (future layout components)
│
└── FixedLogo.tsx    # Root level - controls navigation
```

## 🎯 Usage Notes

### Logo Navigation System
- **FixedLogo.tsx** - The main logo that appears on all pages
  - Click to toggle NavigationPanel
  - Hover for tooltip
  - Scales on interaction

### Navigation Panel
- **NavigationPanel.tsx** - Sliding panel with all page links
  - Opens in new tabs
  - Shows current page
  - Animated entrance/exit

## 🔄 Future Organization
As we add more components, they should be placed in the appropriate folder:
- New buttons → `/buttons`
- New cards → `/cards`
- New tools → `/tools`
- New backgrounds → `/backgrounds`
- General UI → `/ui`