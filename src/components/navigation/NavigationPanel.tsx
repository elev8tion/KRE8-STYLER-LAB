'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationPanelProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function NavigationPanel({ isOpen, onClose }: NavigationPanelProps) {
  const pathname = usePathname();

  const pages = [
    { name: 'Home/Main Page', path: '/' },
    { name: 'Style Guide', path: '/style-guide' },
    { name: 'Claude Dashboard', path: '/claude-dashboard' },
    { name: 'Ollama Chat', path: '/ollama-chat' },
    { name: 'Dev Tools', path: '/dev-tools' },
    { name: 'Position Claude', path: '/position-claude' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-20 left-8 z-[99997]"
        >
          <div className="bg-black/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 min-w-[350px] shadow-2xl shadow-cyan-500/20">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                KRE8-Styler Lab
              </h1>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-white transition-colors text-xl"
                >
                  ×
                </button>
              )}
            </div>
            
            <div className="space-y-2">
              <h2 className="text-cyan-400 text-sm uppercase tracking-wider mb-3">Navigation</h2>
              {pages.map((page, index) => {
                const isCurrent = pathname === page.path;
                return (
                  <motion.div
                    key={page.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {isCurrent ? (
                      <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/50">
                        <span className="text-cyan-400">•</span>
                        <span className="text-gray-300">{page.name}</span>
                        <span className="text-xs text-cyan-400 ml-auto">(current)</span>
                      </div>
                    ) : (
                      <Link href={page.path} target="_blank" rel="noopener noreferrer">
                        <div className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-purple-500/10 hover:border-purple-500/30 border border-transparent transition-all cursor-pointer group">
                          <span className="text-gray-500 group-hover:text-purple-400 transition-colors">→</span>
                          <span className="text-gray-400 group-hover:text-white transition-colors">{page.name}</span>
                          <span className="ml-auto text-xs text-gray-600 group-hover:text-purple-400">↗</span>
                        </div>
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <div className="text-xs text-gray-500">
                <div>Port: <span className="text-cyan-400">3009</span></div>
                <div className="mt-1">Status: <span className="text-green-400">● Running</span></div>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-600 text-center">
              Click logo to toggle navigation
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}