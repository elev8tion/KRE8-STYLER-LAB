'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Trash2, Code2, Eye, Download, Upload, 
  Calendar, Tag, ArrowLeft, Grid, List
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { componentStorage, SavedComponent } from '@/utils/componentStorage';
import dynamic from 'next/dynamic';

const ComponentRenderer = dynamic(() => import('@/components/ComponentRenderer'), { 
  ssr: false,
  loading: () => <div className="text-gray-400">Loading preview...</div>
});

export default function Gallery() {
  const [components, setComponents] = useState<SavedComponent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComponent, setSelectedComponent] = useState<SavedComponent | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = () => {
    const saved = componentStorage.getComponents();
    setComponents(saved);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this component?')) {
      componentStorage.deleteComponent(id);
      loadComponents();
      if (selectedComponent?.id === id) {
        setSelectedComponent(null);
      }
    }
  };

  const handleExport = (component: SavedComponent) => {
    const dataStr = JSON.stringify(component, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${component.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const filteredComponents = searchQuery 
    ? componentStorage.searchComponents(searchQuery)
    : components;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-black/60 backdrop-blur-xl border-b border-cyan-900/30"
      >
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            {/* KRE8 STYLER Logo */}
            <div className="relative" style={{ width: '96px', height: '60px' }}>
              <Image
                src="/kre8-logo.svg"
                alt="KRE8 STYLER"
                width={96}
                height={96}
                style={{
                  position: 'absolute',
                  top: '0px',
                  left: '-14px',
                  filter: 'drop-shadow(0 0 10px rgba(0, 221, 255, 0.5))',
                }}
              />
            </div>
            
            <h1 className="text-2xl font-bold text-cyan-400">Component Gallery</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-900/50 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 w-64"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-1 bg-gray-900/50 p-1 rounded-lg border border-cyan-500/20">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-gray-300'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-gray-300'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Back to Editor */}
            <Link
              href="/styler"
              className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Editor
            </Link>
          </div>
        </div>
      </motion.header>

      <div className="flex h-[calc(100vh-60px)]">
        {/* Component List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredComponents.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-2xl font-bold text-gray-400 mb-2">No Components Yet</h2>
              <p className="text-gray-500 mb-6">Start creating components in the editor!</p>
              <Link
                href="/styler"
                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-all"
              >
                <Code2 className="w-5 h-5" />
                Go to Editor
              </Link>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'space-y-2'
            }>
              {filteredComponents.map((component) => (
                <motion.div
                  key={component.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-gray-900/50 border border-cyan-500/20 rounded-lg overflow-hidden hover:border-cyan-500/50 transition-all cursor-pointer ${
                    selectedComponent?.id === component.id ? 'ring-2 ring-cyan-500' : ''
                  }`}
                  onClick={() => setSelectedComponent(component)}
                >
                  {viewMode === 'grid' ? (
                    <>
                      {/* Preview Thumbnail */}
                      <div className="h-40 bg-gradient-to-br from-gray-900 to-gray-950 p-4 overflow-hidden">
                        <div className="transform scale-75 origin-top-left">
                          <ComponentRenderer code={component.code} css={component.css} />
                        </div>
                      </div>
                      
                      {/* Component Info */}
                      <div className="p-4 border-t border-cyan-500/10">
                        <h3 className="font-semibold text-cyan-400 mb-1">{component.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(component.timestamp).toLocaleDateString()}
                        </div>
                        {component.tags && component.tags.length > 0 && (
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {component.tags.map(tag => (
                              <span key={tag} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Actions */}
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExport(component);
                            }}
                            className="flex-1 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded text-xs transition-all"
                          >
                            Export
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(component.id);
                            }}
                            className="flex-1 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-xs transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-900 to-gray-950 rounded-lg p-2 overflow-hidden">
                          <div className="transform scale-50 origin-top-left">
                            <ComponentRenderer code={component.code} css={component.css} />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-cyan-400 mb-1">{component.name}</h3>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(component.timestamp).toLocaleDateString()}
                            </span>
                            {component.tags && component.tags.length > 0 && (
                              <span className="flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                {component.tags.join(', ')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExport(component);
                          }}
                          className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded transition-all"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(component.id);
                          }}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Component Detail */}
        {selectedComponent && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            className="w-96 bg-gray-900/50 border-l border-cyan-500/20 p-6 overflow-y-auto"
          >
            <h2 className="text-xl font-bold text-cyan-400 mb-4">{selectedComponent.name}</h2>
            
            {/* Preview */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">Preview</h3>
              <div className="bg-gray-950/50 rounded-lg p-4 h-64 overflow-auto">
                <ComponentRenderer code={selectedComponent.code} css={selectedComponent.css} />
              </div>
            </div>

            {/* Code */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">Component Code</h3>
              <pre className="bg-gray-950/50 rounded-lg p-4 text-xs text-gray-300 overflow-auto max-h-64">
                <code>{selectedComponent.code}</code>
              </pre>
            </div>

            {/* CSS */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">Styles</h3>
              <pre className="bg-gray-950/50 rounded-lg p-4 text-xs text-gray-300 overflow-auto max-h-64">
                <code>{selectedComponent.css}</code>
              </pre>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Link
                href={`/styler?load=${selectedComponent.id}`}
                className="flex-1 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded text-center transition-all"
              >
                Open in Editor
              </Link>
              <button
                onClick={() => handleExport(selectedComponent)}
                className="flex-1 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded transition-all"
              >
                Export
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}