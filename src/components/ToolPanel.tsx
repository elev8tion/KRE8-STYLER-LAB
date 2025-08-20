'use client';

import { useState } from 'react';
import { FiX, FiPlay, FiSearch, FiFolder, FiTerminal } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import MonacoEditor from '@monaco-editor/react';
import dynamic from 'next/dynamic';

const ClaudePanel = dynamic(() => import('./ClaudePanel'), { ssr: false });

interface ToolPanelProps {
  tool: string;
  onClose: () => void;
}

export default function ToolPanel({ tool, onClose }: ToolPanelProps) {
  // If it's Claude, render ClaudePanel instead
  if (tool === 'claude') {
    return <ClaudePanel onClose={onClose} />;
  }
  const [code, setCode] = useState('# Write your Python code here\nprint("Hello, World!")');
  const [output, setOutput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);

  const runCode = async () => {
    try {
      // In a real app, this would call a backend API to execute code
      setOutput('Executing code...\n');
      // Simulate execution
      setTimeout(() => {
        setOutput('Hello, World!\n\nCode execution completed successfully.');
      }, 1000);
    } catch (error) {
      setOutput('Error executing code');
    }
  };

  const performSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearchResults(['Searching...']);
    // Simulate search
    setTimeout(() => {
      setSearchResults([
        `Result 1: Information about "${searchQuery}"`,
        `Result 2: Tutorial on "${searchQuery}"`,
        `Result 3: Documentation for "${searchQuery}"`,
        `Result 4: Examples of "${searchQuery}"`,
      ]);
    }, 1000);
  };

  const executeCommand = (cmd: string) => {
    if (!cmd.trim()) return;
    setTerminalHistory(prev => [...prev, `$ ${cmd}`, `Output of: ${cmd}`]);
    setTerminalInput('');
  };

  const renderToolContent = () => {
    switch (tool) {
      case 'code':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 border-b border-gray-700">
              <MonacoEditor
                height="100%"
                language="python"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                }}
              />
            </div>
            <div className="p-4 border-b border-gray-700">
              <button
                onClick={runCode}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FiPlay className="mr-2" /> Run Code
              </button>
            </div>
            <div className="flex-1 p-4 bg-gray-900 font-mono text-sm overflow-auto">
              <pre className="text-green-400">{output || 'Output will appear here...'}</pre>
            </div>
          </div>
        );

      case 'search':
        return (
          <div className="p-6">
            <div className="flex space-x-2 mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && performSearch()}
                placeholder="Search the web..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={performSearch}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center"
              >
                <FiSearch className="mr-2" /> Search
              </button>
            </div>
            <div className="space-y-3">
              {searchResults.map((result, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition-colors cursor-pointer">
                  <p className="text-gray-200">{result}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'files':
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">File Manager</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-750 cursor-pointer">
                <FiFolder className="text-blue-400" />
                <span>Documents</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-750 cursor-pointer">
                <FiFolder className="text-blue-400" />
                <span>Projects</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-750 cursor-pointer">
                <FiFolder className="text-blue-400" />
                <span>Downloads</span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-400">Drag and drop files here or click to browse</p>
            </div>
          </div>
        );

      case 'terminal':
        return (
          <div className="flex flex-col h-full bg-black p-4 font-mono text-sm">
            <div className="flex-1 overflow-auto mb-4">
              <div className="text-green-400">
                <div>KRE8-Styler Lab Terminal v1.0</div>
                <div>Type 'help' for available commands</div>
                <div className="mt-2">
                  {terminalHistory.map((line, index) => (
                    <div key={index} className={line.startsWith('$') ? 'text-white mt-2' : 'text-gray-400'}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-green-400 mr-2">$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && executeCommand(terminalInput)}
                className="flex-1 bg-transparent text-white outline-none"
                placeholder="Enter command..."
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 400 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 400 }}
        className="fixed right-0 top-0 h-screen w-[600px] bg-gray-900 border-l border-gray-800 shadow-2xl z-50 flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold capitalize">{tool} Tool</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FiX />
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          {renderToolContent()}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}