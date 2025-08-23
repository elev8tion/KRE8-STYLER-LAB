'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, Terminal, Settings, Activity, ChevronRight,
  Save, GripVertical, Maximize2, Minimize2, X
} from 'lucide-react';

interface ComponentPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface LayoutConfig {
  header: ComponentPosition;
  sidebar: ComponentPosition;
  stylesPanel: ComponentPosition;
  componentPanel: ComponentPosition;
  aiChatPanel: ComponentPosition;
  previewPanel: ComponentPosition;
  fixedLogo: ComponentPosition;
}

export default function StylerMockup() {
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  const [layout, setLayout] = useState<LayoutConfig>({
    header: { x: 0, y: 0, width: 100, height: 60 },
    sidebar: { x: 0, y: 60, width: 60, height: 100 },
    stylesPanel: { x: 60, y: 60, width: 400, height: 250 },
    componentPanel: { x: 60, y: 310, width: 400, height: 250 },
    aiChatPanel: { x: 60, y: 560, width: 400, height: 200 },
    previewPanel: { x: 460, y: 60, width: 500, height: 700 },
    fixedLogo: { x: 207, y: 689, width: 109, height: 109 }
  });

  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [collapsedPanels, setCollapsedPanels] = useState({
    styles: false,
    component: false,
    aiChat: false
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent, componentId: string, action: 'drag' | 'resize') => {
    e.preventDefault();
    if (action === 'drag') {
      setIsDragging(componentId);
      setDragStart({ x: e.clientX - layout[componentId as keyof LayoutConfig].x, y: e.clientY - layout[componentId as keyof LayoutConfig].y });
    } else {
      setIsResizing(componentId);
      const component = layout[componentId as keyof LayoutConfig];
      setResizeStart({ x: e.clientX, y: e.clientY, width: component.width, height: component.height });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setLayout(prev => ({
          ...prev,
          [isDragging]: {
            ...prev[isDragging as keyof LayoutConfig],
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
          }
        }));
      }
      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        setLayout(prev => ({
          ...prev,
          [isResizing]: {
            ...prev[isResizing as keyof LayoutConfig],
            width: Math.max(100, resizeStart.width + deltaX),
            height: Math.max(50, resizeStart.height + deltaY)
          }
        }));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(null);
      setIsResizing(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart]);

  const saveLayout = () => {
    const layoutJson = JSON.stringify(layout, null, 2);
    console.log('Saved Layout Configuration:', layoutJson);
    navigator.clipboard.writeText(layoutJson);
    alert('Layout saved to clipboard and console!');
  };

  const resetLayout = () => {
    setLayout({
      header: { x: 0, y: 0, width: 100, height: 60 },
      sidebar: { x: 0, y: 60, width: 60, height: 100 },
      stylesPanel: { x: 60, y: 60, width: 400, height: 250 },
      componentPanel: { x: 60, y: 310, width: 400, height: 250 },
      aiChatPanel: { x: 60, y: 560, width: 400, height: 200 },
      previewPanel: { x: 460, y: 60, width: 500, height: 700 },
      fixedLogo: { x: 207, y: 689, width: 109, height: 109 }
    });
  };

  const DraggableComponent = ({ 
    id, 
    title, 
    children, 
    className = "",
    showCollapse = false,
    isCollapsed = false,
    onToggleCollapse
  }: { 
    id: keyof LayoutConfig;
    title: string;
    children: React.ReactNode;
    className?: string;
    showCollapse?: boolean;
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
  }) => {
    const position = layout[id];
    
    return (
      <div
        ref={containerRef}
        className={`absolute border-2 border-cyan-500/50 bg-gray-900/95 rounded-lg overflow-hidden ${className}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${position.width}px`,
          height: isCollapsed ? '40px' : `${position.height}px`,
          transition: isCollapsed ? 'height 0.3s' : undefined
        }}
      >
        {/* Header/Drag Handle */}
        <div 
          className="bg-gray-800 border-b border-cyan-500/30 p-2 cursor-move flex items-center justify-between"
          onMouseDown={(e) => handleMouseDown(e, id, 'drag')}
        >
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-300">{title}</span>
          </div>
          <div className="flex items-center gap-1">
            {showCollapse && (
              <button
                onClick={onToggleCollapse}
                className="p-1 hover:bg-gray-700 rounded"
              >
                {isCollapsed ? <Maximize2 className="w-3 h-3 text-cyan-400" /> : <Minimize2 className="w-3 h-3 text-cyan-400" />}
              </button>
            )}
          </div>
        </div>
        
        {/* Content */}
        {!isCollapsed && (
          <div className="p-3 text-gray-400 text-xs">
            {children}
          </div>
        )}
        
        {/* Resize Handle */}
        {!isCollapsed && (
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-cyan-500/30"
            onMouseDown={(e) => handleMouseDown(e, id, 'resize')}
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Control Panel */}
      <div className="fixed top-4 right-4 z-50 bg-gray-900 border border-cyan-500/50 rounded-lg p-4 space-y-2">
        <h3 className="text-cyan-400 font-bold mb-2">Layout Controls</h3>
        <button
          onClick={saveLayout}
          className="flex items-center gap-2 px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded w-full"
        >
          <Save className="w-4 h-4" />
          Save Layout
        </button>
        <button
          onClick={resetLayout}
          className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded w-full text-sm"
        >
          Reset Layout
        </button>
        <div className="text-xs text-gray-500 mt-2">
          Drag headers to move<br/>
          Drag corners to resize
        </div>
      </div>

      {/* Header */}
      <DraggableComponent id="header" title="Header - KRE8 STYLER Logo">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">K8</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            KRE8 STYLER
          </span>
        </div>
      </DraggableComponent>

      {/* Expandable Sidebar */}
      <DraggableComponent id="sidebar" title="Expandable Sidebar">
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 bg-gray-800 rounded">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span className={`${sidebarExpanded ? 'block' : 'hidden'}`}>AI Chat</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-800 rounded">
            <Terminal className="w-4 h-4 text-purple-400" />
            <span className={`${sidebarExpanded ? 'block' : 'hidden'}`}>MCP Tools</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-800 rounded">
            <Settings className="w-4 h-4 text-gray-400" />
            <span className={`${sidebarExpanded ? 'block' : 'hidden'}`}>Settings</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-800 rounded">
            <Activity className="w-4 h-4 text-green-400" />
            <span className={`${sidebarExpanded ? 'block' : 'hidden'}`}>Activity</span>
          </div>
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="mt-2 p-1 bg-cyan-500/20 rounded w-full"
          >
            {sidebarExpanded ? '← Collapse' : '→ Expand'}
          </button>
        </div>
      </DraggableComponent>

      {/* Middle Section - Three Collapsible Panels */}
      <DraggableComponent 
        id="stylesPanel" 
        title="Styles Panel"
        showCollapse={true}
        isCollapsed={collapsedPanels.styles}
        onToggleCollapse={() => setCollapsedPanels(prev => ({ ...prev, styles: !prev.styles }))}
      >
        <div className="space-y-2">
          <div className="p-2 bg-gray-800 rounded">
            <div className="text-cyan-400">CSS / Styled Components</div>
            <div className="text-xs mt-1">Edit component styles here</div>
          </div>
          <div className="p-2 bg-gray-800 rounded">
            <div className="text-purple-400">Theme Variables</div>
            <div className="text-xs mt-1">Colors, spacing, typography</div>
          </div>
        </div>
      </DraggableComponent>

      <DraggableComponent 
        id="componentPanel" 
        title="Component Code Panel"
        showCollapse={true}
        isCollapsed={collapsedPanels.component}
        onToggleCollapse={() => setCollapsedPanels(prev => ({ ...prev, component: !prev.component }))}
      >
        <div className="space-y-2">
          <div className="p-2 bg-gray-800 rounded">
            <div className="text-cyan-400">React Component Code</div>
            <div className="text-xs mt-1">TSX/JSX editor with syntax highlighting</div>
          </div>
          <div className="p-2 bg-gray-800 rounded">
            <div className="text-purple-400">Props & State</div>
            <div className="text-xs mt-1">Component configuration</div>
          </div>
        </div>
      </DraggableComponent>

      <DraggableComponent 
        id="aiChatPanel" 
        title="AI Chat Panel"
        showCollapse={true}
        isCollapsed={collapsedPanels.aiChat}
        onToggleCollapse={() => setCollapsedPanels(prev => ({ ...prev, aiChat: !prev.aiChat }))}
      >
        <div className="space-y-2">
          <div className="p-2 bg-gray-800 rounded">
            <div className="text-cyan-400">AI Assistant</div>
            <div className="text-xs mt-1">Get help with component development</div>
          </div>
          <div className="p-2 bg-gray-800 rounded">
            <div className="text-purple-400">Chat History</div>
            <div className="text-xs mt-1">Previous conversations</div>
          </div>
        </div>
      </DraggableComponent>

      {/* Right Section - Live Preview */}
      <DraggableComponent id="previewPanel" title="Live Preview">
        <div className="h-full flex flex-col items-center justify-center text-center">
          <div className="text-cyan-400 text-lg mb-2">Component Preview Area</div>
          <div className="text-xs text-gray-500">
            Real-time preview of your component
          </div>
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <div className="w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Preview</span>
            </div>
          </div>
        </div>
      </DraggableComponent>

      {/* KRE8 Fixed Logo (from bottom left) - MOVEABLE */}
      <DraggableComponent id="fixedLogo" title="KRE8 LOGO (Bottom Left)">
        <div className="flex items-center justify-center p-4">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/50">
              <span className="text-white font-bold text-3xl">K8</span>
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <span className="text-xs font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                KRE8 STYLER
              </span>
            </div>
          </div>
        </div>
      </DraggableComponent>
    </div>
  );
}